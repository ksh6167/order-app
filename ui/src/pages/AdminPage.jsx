import { useState, useEffect } from 'react';
import MetricsBar from '../components/MetricsBar';
import InventoryCard from '../components/InventoryCard';
import OrderRow from '../components/OrderRow';
import { adminApi } from '../services/api';
import './AdminPage.css';

function AdminPage({ onStockUpdate }) {
  const [metrics, setMetrics] = useState({ total: 0, accepted: 0, inProgress: 0, done: 0 });
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 로드
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 병렬로 데이터 로드
      const [metricsData, stockData, ordersData] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getStock(),
        adminApi.getOrders()
      ]);
      
      setMetrics(metricsData);
      setInventory(stockData.items || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 재고 수정
  const handleUpdateStock = async (productId, delta) => {
    try {
      await adminApi.updateStock(productId, delta);
      
      // 재고 목록 새로고침
      const stockData = await adminApi.getStock();
      setInventory(stockData.items || []);
      
      // App.jsx의 재고 동기화
      if (onStockUpdate) {
        onStockUpdate();
      }
    } catch (err) {
      console.error('재고 수정 실패:', err);
      alert(err.message || '재고 수정에 실패했습니다.');
    }
  };

  // 주문 상태 변경
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // 상태에 따라 적절한 API 호출
      if (newStatus === 'ACCEPTED') {
        await adminApi.acceptOrder(orderId);
      } else if (newStatus === 'IN_PROGRESS') {
        await adminApi.startOrder(orderId);
      } else if (newStatus === 'DONE') {
        await adminApi.completeOrder(orderId);
      }
      
      // 데이터 새로고침 (메트릭, 재고, 주문 목록 모두)
      await fetchData();
      
      // App.jsx의 재고 동기화 (ACCEPTED 시 재고 차감됨)
      if (newStatus === 'ACCEPTED' && onStockUpdate) {
        onStockUpdate();
      }
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert(err.message || '상태 변경에 실패했습니다.');
      
      // 에러 발생 시에도 데이터 새로고침 (롤백 확인용)
      await fetchData();
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchData} style={{ marginTop: '20px' }}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <MetricsBar metrics={metrics} />
      
      <section className="admin-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="inventory-grid">
          {inventory.map(item => (
            <InventoryCard
              key={item.productId}
              item={item}
              onUpdateStock={handleUpdateStock}
            />
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2 className="section-title">주문 현황</h2>
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="empty-message">주문이 없습니다</p>
          ) : (
            orders.map(order => (
              <OrderRow
                key={order.orderId}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminPage;

