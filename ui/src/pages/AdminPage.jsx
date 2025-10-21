import { useState } from 'react';
import MetricsBar from '../components/MetricsBar';
import InventoryCard from '../components/InventoryCard';
import OrderRow from '../components/OrderRow';
import './AdminPage.css';

// 임시 재고 데이터
const INITIAL_INVENTORY = [
  { productId: 'americano-ice', name: '아메리카노(ICE)', stock: 10 },
  { productId: 'americano-hot', name: '아메리카노(HOT)', stock: 3 },
  { productId: 'caffe-latte', name: '카페라떼', stock: 0 }
];

function AdminPage({ orders, onStatusChange }) {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  // 메트릭 계산
  const metrics = {
    total: orders.length,
    accepted: orders.filter(o => o.status === 'ACCEPTED').length,
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    done: orders.filter(o => o.status === 'DONE').length
  };

  // 재고 업데이트
  const handleUpdateStock = (productId, delta) => {
    setInventory(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, stock: Math.max(0, Math.min(999, item.stock + delta)) }
          : item
      )
    );
  };

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
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminPage;

