const db = require('../config/database');

const Menu = {
  // 모든 메뉴와 옵션 조회
  async getAllWithOptions() {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.price,
        m.description,
        m.image_url as "imageUrl",
        m.stock,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'priceDelta', o.price_delta
            )
            ORDER BY o.id
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'
        ) as options
      FROM menus m
      LEFT JOIN menu_options mo ON m.id = mo.menu_id
      LEFT JOIN options o ON mo.option_id = o.id
      GROUP BY m.id
      ORDER BY m.id
    `;

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in Menu.getAllWithOptions:', error);
      throw error;
    }
  },

  // 재고 목록 조회
  async getStock() {
    const query = `
      SELECT 
        id as "productId",
        name,
        stock
      FROM menus
      ORDER BY id
    `;

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in Menu.getStock:', error);
      throw error;
    }
  },

  // 재고 수정
  async updateStock(productId, delta) {
    try {
      // 현재 재고 조회
      const checkQuery = 'SELECT stock FROM menus WHERE id = $1';
      const checkResult = await db.query(checkQuery, [productId]);

      if (checkResult.rows.length === 0) {
        return null; // 메뉴를 찾을 수 없음
      }

      const currentStock = checkResult.rows[0].stock;
      const newStock = currentStock + delta;

      // 재고 검증
      if (newStock < 0) {
        return {
          error: '재고가 0 미만으로 떨어질 수 없습니다.'
        };
      }

      // 재고 업데이트 (최대 999로 제한)
      const finalStock = Math.min(newStock, 999);
      const updateQuery = 'UPDATE menus SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, stock';
      const updateResult = await db.query(updateQuery, [finalStock, productId]);

      return {
        productId: updateResult.rows[0].id,
        stock: updateResult.rows[0].stock
      };
    } catch (error) {
      console.error('Error in Menu.updateStock:', error);
      throw error;
    }
  },

  // 재고 차감 (주문 접수 시)
  async decreaseStock(productId, quantity) {
    try {
      const checkQuery = 'SELECT stock FROM menus WHERE id = $1';
      const checkResult = await db.query(checkQuery, [productId]);

      if (checkResult.rows.length === 0) {
        return { error: `메뉴를 찾을 수 없습니다: ${productId}` };
      }

      const currentStock = checkResult.rows[0].stock;

      if (currentStock < quantity) {
        const menuQuery = 'SELECT name FROM menus WHERE id = $1';
        const menuResult = await db.query(menuQuery, [productId]);
        const menuName = menuResult.rows[0].name;
        return {
          error: `재고 부족: ${menuName}의 재고가 부족합니다 (현재: ${currentStock}, 필요: ${quantity})`
        };
      }

      const updateQuery = 'UPDATE menus SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
      await db.query(updateQuery, [quantity, productId]);

      return { success: true };
    } catch (error) {
      console.error('Error in Menu.decreaseStock:', error);
      throw error;
    }
  }
};

module.exports = Menu;

