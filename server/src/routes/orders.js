const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders/:orderId - 주문 조회
router.get('/:orderId', orderController.getOrder);

module.exports = router;

