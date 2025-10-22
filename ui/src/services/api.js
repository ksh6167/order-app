const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API 에러 처리 헬퍼
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '요청에 실패했습니다.' }));
    throw new Error(error.error?.message || error.message || '요청에 실패했습니다.');
  }
  return response.json();
};

// 메뉴 API
export const menuApi = {
  // 메뉴 목록 조회
  async getMenuList() {
    const response = await fetch(`${API_BASE_URL}/menu`);
    return handleResponse(response);
  }
};

// 주문 API
export const orderApi = {
  // 주문 생성
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  // 주문 조회
  async getOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return handleResponse(response);
  }
};

// 관리자 API
export const adminApi = {
  // 메트릭 조회
  async getMetrics() {
    const response = await fetch(`${API_BASE_URL}/admin/metrics`);
    return handleResponse(response);
  },

  // 재고 목록 조회
  async getStock() {
    const response = await fetch(`${API_BASE_URL}/admin/stock`);
    return handleResponse(response);
  },

  // 재고 수정
  async updateStock(productId, delta) {
    const response = await fetch(`${API_BASE_URL}/admin/stock/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ delta })
    });
    return handleResponse(response);
  },

  // 주문 목록 조회
  async getOrders(status) {
    const url = status 
      ? `${API_BASE_URL}/admin/orders?status=${status}`
      : `${API_BASE_URL}/admin/orders`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // 주문 접수 (NEW -> ACCEPTED, 재고 차감)
  async acceptOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/accept`, {
      method: 'POST'
    });
    return handleResponse(response);
  },

  // 제조 시작 (ACCEPTED -> IN_PROGRESS)
  async startOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/start`, {
      method: 'POST'
    });
    return handleResponse(response);
  },

  // 제조 완료 (IN_PROGRESS -> DONE)
  async completeOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/complete`, {
      method: 'POST'
    });
    return handleResponse(response);
  }
};

