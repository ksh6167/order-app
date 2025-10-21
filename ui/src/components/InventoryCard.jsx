import './InventoryCard.css';

function InventoryCard({ item, onUpdateStock }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: '품절', className: 'out-of-stock' };
    if (stock < 5) return { label: '주의', className: 'low-stock' };
    return { label: '정상', className: 'normal' };
  };

  const status = getStockStatus(item.stock);

  const handleIncrease = () => {
    onUpdateStock(item.productId, 1);
  };

  const handleDecrease = () => {
    if (item.stock > 0) {
      onUpdateStock(item.productId, -1);
    }
  };

  return (
    <div className="inventory-card">
      <div className="inventory-header">
        <h4 className="inventory-name">{item.name}</h4>
      </div>
      <div className="inventory-controls">
        <button
          className="stock-button decrease"
          onClick={handleDecrease}
          disabled={item.stock === 0}
          aria-label="재고 감소"
        >
          −
        </button>
        <div className="stock-display">
          <span className="stock-number">{item.stock}</span>
          <span className="stock-unit">개</span>
          <span className={`stock-status ${status.className}`}>
            {status.label}
          </span>
        </div>
        <button
          className="stock-button increase"
          onClick={handleIncrease}
          aria-label="재고 증가"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default InventoryCard;

