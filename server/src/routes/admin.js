const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/metrics - 관리자 대시보드 메트릭
router.get('/metrics', adminController.getMetrics);

// GET /api/admin/stock - 재고 목록 조회
router.get('/stock', adminController.getStock);

// PATCH /api/admin/stock/:productId - 재고 수량 수정
router.patch('/stock/:productId', adminController.updateStock);

// GET /api/admin/orders - 주문 목록 조회
router.get('/orders', adminController.getOrders);

// POST /api/admin/orders/:orderId/accept - 주문 접수
router.post('/orders/:orderId/accept', adminController.acceptOrder);

// POST /api/admin/orders/:orderId/start - 제조 시작
router.post('/orders/:orderId/start', adminController.startOrder);

// POST /api/admin/orders/:orderId/complete - 제조 완료
router.post('/orders/:orderId/complete', adminController.completeOrder);

module.exports = router;

