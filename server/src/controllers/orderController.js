const Order = require('../models/Order');

const orderController = {
  // 주문 생성
  async createOrder(req, res) {
    try {
      const { items, total } = req.body;

      // 입력 검증
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: '주문 항목이 필요합니다.'
          }
        });
      }

      if (typeof total !== 'number' || total < 0) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: '유효한 총 금액이 필요합니다.'
          }
        });
      }

      const order = await Order.create({ items, total });
      
      res.status(201).json({
        orderId: order.order_id,
        status: order.status,
        createdAt: order.created_at
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 생성에 실패했습니다.'
        }
      });
    }
  },

  // 특정 주문 조회
  async getOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByOrderId(orderId);

      if (!order) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: '주문을 찾을 수 없습니다.'
          }
        });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 조회에 실패했습니다.'
        }
      });
    }
  }
};

module.exports = orderController;

