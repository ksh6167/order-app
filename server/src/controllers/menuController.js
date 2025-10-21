// 메뉴 컨트롤러

const getMenuList = async (req, res, next) => {
  try {
    // TODO: 데이터베이스에서 메뉴 조회
    res.json({
      items: [
        {
          id: 'americano-ice',
          name: '아메리카노(ICE)',
          price: 4000,
          description: '깊고 진한 에스프레소에 시원한 얼음을 더한 클래식 커피',
          imageUrl: null,
          stock: 15,
          options: [
            { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
            { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
          ]
        }
      ]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuList
};

