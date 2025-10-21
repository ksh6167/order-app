const db = require('../config/database');
const Menu = require('./Menu');

const Order = {
  // 주문 생성
  async create({ items, total }) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 주문 ID 생성 (001, 002, 003...)
      const countQuery = 'SELECT COUNT(*) as count FROM orders';
      const countResult = await client.query(countQuery);
      const orderId = String(parseInt(countResult.rows[0].count) + 1).padStart(3, '0');

      // Orders 테이블에 주문 생성
      const orderQuery = `
        INSERT INTO orders (order_id, total, status)
        VALUES ($1, $2, 'NEW')
        RETURNING id, order_id, status, created_at
      `;
      const orderResult = await client.query(orderQuery, [orderId, total]);
      const order = orderResult.rows[0];

      // OrderItems 및 OrderItemOptions 생성
      for (const item of items) {
        // 메뉴 정보 조회
        const menuQuery = 'SELECT name, price FROM menus WHERE id = $1';
        const menuResult = await client.query(menuQuery, [item.productId]);
        const menu = menuResult.rows[0];

        // 옵션 가격 조회
        let unitPrice = menu.price;
        if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
          const optionQuery = 'SELECT price_delta FROM options WHERE id = ANY($1)';
          const optionResult = await client.query(optionQuery, [item.selectedOptionIds]);
          unitPrice += optionResult.rows.reduce((sum, opt) => sum + opt.price_delta, 0);
        }

        const lineTotal = unitPrice * item.quantity;

        // OrderItems에 추가
        const orderItemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `;
        const orderItemResult = await client.query(orderItemQuery, [
          order.id,
          item.productId,
          menu.name,
          item.quantity,
          unitPrice,
          lineTotal
        ]);
        const orderItemId = orderItemResult.rows[0].id;

        // OrderItemOptions에 추가
        if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
          for (const optionId of item.selectedOptionIds) {
            const optNameQuery = 'SELECT name FROM options WHERE id = $1';
            const optNameResult = await client.query(optNameQuery, [optionId]);
            const optionName = optNameResult.rows[0].name;

            const optionQuery = `
              INSERT INTO order_item_options (order_item_id, option_name)
              VALUES ($1, $2)
            `;
            await client.query(optionQuery, [orderItemId, optionName]);
          }
        }
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in Order.create:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // 주문 조회 (orderId로)
  async findByOrderId(orderId) {
    const query = `
      SELECT 
        o.order_id as "orderId",
        o.created_at as "createdAt",
        o.total,
        o.status,
        json_agg(
          json_build_object(
            'productId', oi.product_id,
            'name', oi.product_name,
            'selectedOptions', (
              SELECT COALESCE(json_agg(oio.option_name), '[]')
              FROM order_item_options oio
              WHERE oio.order_item_id = oi.id
            ),
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
          ORDER BY oi.id
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.order_id = $1
      GROUP BY o.id
    `;

    try {
      const result = await db.query(query, [orderId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error in Order.findByOrderId:', error);
      throw error;
    }
  },

  // 모든 주문 조회 (status 필터 옵션)
  async findAll(status) {
    let query = `
      SELECT 
        o.order_id as "orderId",
        o.created_at as "createdAt",
        o.total,
        o.status,
        json_agg(
          json_build_object(
            'productId', oi.product_id,
            'name', oi.product_name,
            'selectedOptions', (
              SELECT COALESCE(json_agg(oio.option_name), '[]')
              FROM order_item_options oio
              WHERE oio.order_item_id = oi.id
            ),
            'quantity', oi.quantity,
            'lineTotal', oi.line_total
          )
          ORDER BY oi.id
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
    `;

    const params = [];
    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at ASC';

    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error in Order.findAll:', error);
      throw error;
    }
  },

  // 메트릭 조회
  async getMetrics() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'ACCEPTED') as accepted,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as "inProgress",
        COUNT(*) FILTER (WHERE status = 'DONE') as done
      FROM orders
    `;

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Order.getMetrics:', error);
      throw error;
    }
  },

  // 주문 접수 (재고 차감 포함)
  async accept(orderId) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 주문 조회
      const orderQuery = 'SELECT id, status FROM orders WHERE order_id = $1';
      const orderResult = await client.query(orderQuery, [orderId]);

      if (orderResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return {
          error: '주문을 찾을 수 없습니다.',
          code: 'NOT_FOUND'
        };
      }

      const order = orderResult.rows[0];

      if (order.status !== 'NEW') {
        await client.query('ROLLBACK');
        return {
          error: '이미 접수된 주문이거나 상태 전환이 불가능합니다.',
          code: 'INVALID_STATUS'
        };
      }

      // 주문 항목 조회
      const itemsQuery = 'SELECT product_id, quantity FROM order_items WHERE order_id = $1';
      const itemsResult = await client.query(itemsQuery, [order.id]);

      // 재고 확인 및 차감
      for (const item of itemsResult.rows) {
        const stockResult = await Menu.decreaseStock(item.product_id, item.quantity);
        if (stockResult.error) {
          await client.query('ROLLBACK');
          return {
            error: stockResult.error,
            code: 'STOCK_INSUFFICIENT'
          };
        }
      }

      // 주문 상태 업데이트
      const updateQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING order_id, status';
      const updateResult = await client.query(updateQuery, ['ACCEPTED', order.id]);

      await client.query('COMMIT');
      return {
        orderId: updateResult.rows[0].order_id,
        status: updateResult.rows[0].status
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in Order.accept:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // 제조 시작
  async start(orderId) {
    try {
      const checkQuery = 'SELECT status FROM orders WHERE order_id = $1';
      const checkResult = await db.query(checkQuery, [orderId]);

      if (checkResult.rows.length === 0) {
        return {
          error: '주문을 찾을 수 없습니다.',
          code: 'NOT_FOUND'
        };
      }

      if (checkResult.rows[0].status !== 'ACCEPTED') {
        return {
          error: '주문 접수 상태에서만 제조를 시작할 수 있습니다.',
          code: 'INVALID_STATUS'
        };
      }

      const updateQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING order_id, status';
      const updateResult = await db.query(updateQuery, ['IN_PROGRESS', orderId]);

      return {
        orderId: updateResult.rows[0].order_id,
        status: updateResult.rows[0].status
      };
    } catch (error) {
      console.error('Error in Order.start:', error);
      throw error;
    }
  },

  // 제조 완료
  async complete(orderId) {
    try {
      const checkQuery = 'SELECT status FROM orders WHERE order_id = $1';
      const checkResult = await db.query(checkQuery, [orderId]);

      if (checkResult.rows.length === 0) {
        return {
          error: '주문을 찾을 수 없습니다.',
          code: 'NOT_FOUND'
        };
      }

      if (checkResult.rows[0].status !== 'IN_PROGRESS') {
        return {
          error: '제조 중 상태에서만 완료할 수 있습니다.',
          code: 'INVALID_STATUS'
        };
      }

      const updateQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING order_id, status';
      const updateResult = await db.query(updateQuery, ['DONE', orderId]);

      return {
        orderId: updateResult.rows[0].order_id,
        status: updateResult.rows[0].status
      };
    } catch (error) {
      console.error('Error in Order.complete:', error);
      throw error;
    }
  }
};

module.exports = Order;

