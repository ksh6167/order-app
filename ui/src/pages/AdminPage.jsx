import MetricsBar from '../components/MetricsBar';
import InventoryCard from '../components/InventoryCard';
import OrderRow from '../components/OrderRow';
import './AdminPage.css';

function AdminPage({ orders, inventory, onStatusChange, onUpdateStock }) {
  // 메트릭 계산
  const metrics = {
    total: orders.length,
    accepted: orders.filter(o => o.status === 'ACCEPTED').length,
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    done: orders.filter(o => o.status === 'DONE').length
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
              onUpdateStock={onUpdateStock}
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

