const Menu = require('../models/Menu');

const menuController = {
  // 메뉴 목록 조회
  async getMenuList(req, res) {
    try {
      const items = await Menu.getAllWithOptions();
      res.json({ items });
    } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: '메뉴 조회에 실패했습니다.'
        }
      });
    }
  }
};

module.exports = menuController;

