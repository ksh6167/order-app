const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menu - 메뉴 목록 조회
router.get('/', menuController.getMenuList);

module.exports = router;

