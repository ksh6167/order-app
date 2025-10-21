import './OrderRow.css';

function OrderRow({ order, onStatusChange }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'NEW':
        return { label: '신규 주문', buttonText: '주문 접수', nextStatus: 'ACCEPTED', className: 'status-new' };
      case 'ACCEPTED':
        return { label: '접수 완료', buttonText: '제조 시작', nextStatus: 'IN_PROGRESS', className: 'status-accepted' };
      case 'IN_PROGRESS':
        return { label: '제조 중', buttonText: '제조 완료', nextStatus: 'DONE', className: 'status-in-progress' };
      case 'DONE':
        return { label: '완료', buttonText: null, nextStatus: null, className: 'status-done' };
      default:
        return { label: '알 수 없음', buttonText: null, nextStatus: null, className: '' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const handleStatusChange = () => {
    if (statusInfo.nextStatus) {
      onStatusChange(order.orderId, statusInfo.nextStatus);
    }
  };

  return (
    <div className="order-row">
      <div className="order-header">
        <div className="order-id">주문 #{order.orderId}</div>
        <span className={`order-status ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>
      
      <div className="order-info">
        <div className="order-time">
          <span className="info-label">주문 시간:</span>
          <span className="info-value">{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="order-items">
          <span className="info-label">주문 내역:</span>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-line">
                {item.name}
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <span className="item-options">
                    ({item.selectedOptions.join(', ')})
                  </span>
                )}
                <span className="item-quantity">x {item.quantity}</span>
                <span className="item-price">{item.lineTotal.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-total">
          <span className="info-label">총 금액:</span>
          <span className="total-value">{order.total.toLocaleString()}원</span>
        </div>
      </div>
      
      {statusInfo.buttonText && (
        <button 
          className="status-button"
          onClick={handleStatusChange}
        >
          {statusInfo.buttonText}
        </button>
      )}
    </div>
  );
}

export default OrderRow;

