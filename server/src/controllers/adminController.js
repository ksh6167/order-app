const Order = require('../models/Order');
const Menu = require('../models/Menu');

const adminController = {
  // 메트릭 조회
  async getMetrics(req, res) {
    try {
      const metrics = await Order.getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '메트릭 조회에 실패했습니다.'
        }
      });
    }
  },

  // 재고 목록 조회
  async getStock(req, res) {
    try {
      const items = await Menu.getStock();
      res.json({ items });
    } catch (error) {
      console.error('Error fetching stock:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '재고 조회에 실패했습니다.'
        }
      });
    }
  },

  // 재고 수량 수정
  async updateStock(req, res) {
    try {
      const { productId } = req.params;
      const { delta } = req.body;

      if (typeof delta !== 'number') {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'delta 값이 필요합니다.'
          }
        });
      }

      const result = await Menu.updateStock(productId, delta);

      if (!result) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: '메뉴를 찾을 수 없습니다.'
          }
        });
      }

      if (result.error) {
        return res.status(409).json({
          error: {
            code: 'STOCK_INSUFFICIENT',
            message: result.error
          }
        });
      }

      res.json(result);
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '재고 수정에 실패했습니다.'
        }
      });
    }
  },

  // 주문 목록 조회
  async getOrders(req, res) {
    try {
      const { status } = req.query;
      const orders = await Order.findAll(status);
      res.json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 목록 조회에 실패했습니다.'
        }
      });
    }
  },

  // 주문 접수
  async acceptOrder(req, res) {
    try {
      const { orderId } = req.params;
      const result = await Order.accept(orderId);

      if (result.error) {
        if (result.code === 'NOT_FOUND') {
          return res.status(404).json({ error: result });
        } else if (result.code === 'INVALID_STATUS') {
          return res.status(400).json({ error: result });
        } else if (result.code === 'STOCK_INSUFFICIENT') {
          return res.status(409).json({ error: result });
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Error accepting order:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '주문 접수에 실패했습니다.'
        }
      });
    }
  },

  // 제조 시작
  async startOrder(req, res) {
    try {
      const { orderId } = req.params;
      const result = await Order.start(orderId);

      if (result.error) {
        if (result.code === 'NOT_FOUND') {
          return res.status(404).json({ error: result });
        } else if (result.code === 'INVALID_STATUS') {
          return res.status(400).json({ error: result });
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Error starting order:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '제조 시작에 실패했습니다.'
        }
      });
    }
  },

  // 제조 완료
  async completeOrder(req, res) {
    try {
      const { orderId } = req.params;
      const result = await Order.complete(orderId);

      if (result.error) {
        if (result.code === 'NOT_FOUND') {
          return res.status(404).json({ error: result });
        } else if (result.code === 'INVALID_STATUS') {
          return res.status(400).json({ error: result });
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Error completing order:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '제조 완료에 실패했습니다.'
        }
      });
    }
  }
};

module.exports = adminController;

