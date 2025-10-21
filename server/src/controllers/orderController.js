// 주문 컨트롤러

const createOrder = async (req, res, next) => {
  try {
    const { items, total } = req.body;

    // TODO: 주문 생성 로직 구현
    res.status(201).json({
      orderId: '001',
      status: 'NEW',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // TODO: 주문 조회 로직 구현
    res.json({
      orderId,
      createdAt: new Date().toISOString(),
      items: [],
      total: 0,
      status: 'NEW'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrder
};

