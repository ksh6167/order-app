// 관리자 컨트롤러

const getMetrics = async (req, res, next) => {
  try {
    // TODO: 메트릭 조회 로직 구현
    res.json({
      total: 0,
      accepted: 0,
      inProgress: 0,
      done: 0
    });
  } catch (error) {
    next(error);
  }
};

const getStockList = async (req, res, next) => {
  try {
    // TODO: 재고 목록 조회 로직 구현
    res.json({
      items: []
    });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { delta } = req.body;

    // TODO: 재고 업데이트 로직 구현
    res.json({
      productId,
      stock: 0
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    // TODO: 주문 목록 조회 로직 구현
    res.json({
      orders: []
    });
  } catch (error) {
    next(error);
  }
};

const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // TODO: 주문 접수 로직 구현 (재고 차감 포함)
    res.json({
      orderId,
      status: 'ACCEPTED'
    });
  } catch (error) {
    next(error);
  }
};

const startOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // TODO: 제조 시작 로직 구현
    res.json({
      orderId,
      status: 'IN_PROGRESS'
    });
  } catch (error) {
    next(error);
  }
};

const completeOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // TODO: 제조 완료 로직 구현
    res.json({
      orderId,
      status: 'DONE'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  getStockList,
  updateStock,
  getOrders,
  acceptOrder,
  startOrder,
  completeOrder
};

