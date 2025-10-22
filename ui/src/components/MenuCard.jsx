import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ product, stock, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const isOutOfStock = stock === 0;

  const handleOptionChange = (option, checked) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter(opt => opt.id !== option.id));
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedOptions: [...selectedOptions]
    });
    // 담기 후 체크박스 초기화
    setSelectedOptions([]);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="menu-image-img" />
        ) : (
          <div className="image-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="menu-info">
        <div className="menu-header-info">
          <h3 className="menu-name">{product.name}</h3>
          {isOutOfStock && <span className="out-of-stock-badge">품절</span>}
        </div>
        <p className="menu-price">{product.price.toLocaleString()}원</p>
        <p className="menu-description">{product.description}</p>
        
        {product.options && product.options.length > 0 && (
          <div className="menu-options">
            {product.options.map(option => (
              <label key={option.id} className="option-item">
                <input
                  type="checkbox"
                  checked={selectedOptions.some(opt => opt.id === option.id)}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                />
                <span>{option.name} ({option.priceDelta > 0 ? `+${option.priceDelta}원` : `+${option.priceDelta}원`})</span>
              </label>
            ))}
          </div>
        )}
        
        <button 
          className="add-button" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '품절' : '담기'}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

