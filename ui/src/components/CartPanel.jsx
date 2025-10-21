import './CartPanel.css';

function CartPanel({ cart, onRemoveItem, onIncreaseQuantity, onDecreaseQuantity, onOrder }) {
  const isEmpty = cart.items.length === 0;

  return (
    <div className="cart-panel">
      <div className="cart-content">
        <div className="cart-left">
          <h3 className="cart-title">장바구니</h3>
          {isEmpty ? (
            <p className="empty-message">장바구니가 비어 있습니다</p>
          ) : (
            <div className="cart-list">
              {cart.items.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">
                      {item.name}
                      {item.selectedOptions.length > 0 && (
                        <span className="item-options">
                          ({item.selectedOptions.map(opt => opt.name).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => onDecreaseQuantity(index)}
                        aria-label="수량 감소"
                      >
                        −
                      </button>
                      <span className="item-quantity">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => onIncreaseQuantity(index)}
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                    </div>
                    <span className="item-price">{item.lineTotal.toLocaleString()}원</span>
                    <button
                      className="remove-button"
                      onClick={() => onRemoveItem(index)}
                      aria-label="삭제"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="cart-right">
          <div className="total-row">
            <span className="total-label">총 금액</span>
            <span className="total-amount">{cart.total.toLocaleString()}원</span>
          </div>
          <button
            className="order-button"
            disabled={isEmpty}
            onClick={onOrder}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPanel;

