import { useState } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import CartPanel from './components/CartPanel';
import AdminPage from './pages/AdminPage';
import './App.css';

// 임시 메뉴 데이터
const MENU_DATA = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'caffe-latte',
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    price: 5000,
    description: '부드러운 우유 거품과 에스프레소의 조화',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'cinnamon', name: '시나몬 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼',
    price: 5500,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'whipped-cream', name: '휘핑크림 추가', priceDelta: 500 }
    ]
  },
  {
    id: 'caramel-macchiato',
    name: '캬라멜 마키아또',
    price: 6000,
    description: '달콤한 캬라멜과 에스프레소의 완벽한 조화',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'extra-caramel', name: '캬라멜 시럽 추가', priceDelta: 500 }
    ]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [orders, setOrders] = useState([]);
  const [orderIdCounter, setOrderIdCounter] = useState(1);

  // 장바구니에 상품 추가
  const handleAddToCart = (productWithOptions) => {
    const { id, name, price, selectedOptions } = productWithOptions;
    
    // 단위 가격 계산 (기본 가격 + 옵션 가격)
    const unitPrice = price + selectedOptions.reduce((sum, opt) => sum + opt.priceDelta, 0);
    
    // 동일한 상품 + 옵션 조합이 이미 있는지 확인
    const existingItemIndex = cart.items.findIndex(item => {
      const sameProduct = item.productId === id;
      const sameOptions = 
        item.selectedOptions.length === selectedOptions.length &&
        item.selectedOptions.every(opt => 
          selectedOptions.some(selOpt => selOpt.id === opt.id)
        );
      return sameProduct && sameOptions;
    });

    let newItems;
    if (existingItemIndex >= 0) {
      // 기존 항목 수량 증가
      newItems = [...cart.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1,
        lineTotal: (newItems[existingItemIndex].quantity + 1) * unitPrice
      };
    } else {
      // 새 항목 추가
      const newItem = {
        productId: id,
        name,
        selectedOptions,
        quantity: 1,
        unitPrice,
        lineTotal: unitPrice
      };
      newItems = [...cart.items, newItem];
    }

    // 총액 계산
    const newTotal = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    
    setCart({ items: newItems, total: newTotal });
    
    // 토스트 메시지 (간단히 alert로 구현, 추후 Toast 컴포넌트로 교체 가능)
    showToast('담겼습니다');
  };

  // 장바구니에서 항목 제거
  const handleRemoveItem = (index) => {
    const newItems = cart.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    setCart({ items: newItems, total: newTotal });
  };

  // 장바구니에서 수량 증가
  const handleIncreaseQuantity = (index) => {
    const newItems = [...cart.items];
    const item = newItems[index];
    item.quantity += 1;
    item.lineTotal = item.unitPrice * item.quantity;
    
    const newTotal = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    setCart({ items: newItems, total: newTotal });
  };

  // 장바구니에서 수량 감소
  const handleDecreaseQuantity = (index) => {
    const newItems = [...cart.items];
    const item = newItems[index];
    
    if (item.quantity <= 1) {
      // 수량이 1이면 항목 제거
      handleRemoveItem(index);
    } else {
      item.quantity -= 1;
      item.lineTotal = item.unitPrice * item.quantity;
      
      const newTotal = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
      setCart({ items: newItems, total: newTotal });
    }
  };

  // 주문하기
  const handleOrder = () => {
    if (cart.items.length === 0) return;
    
    // 새 주문 생성
    const newOrder = {
      orderId: String(orderIdCounter).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        selectedOptions: item.selectedOptions.map(opt => opt.name),
        quantity: item.quantity,
        lineTotal: item.lineTotal
      })),
      total: cart.total,
      status: 'NEW'
    };
    
    // 주문 목록에 추가
    setOrders(prev => [newOrder, ...prev]);
    setOrderIdCounter(prev => prev + 1);
    
    showToast('주문이 완료되었습니다!');
    
    // 장바구니 초기화
    setCart({ items: [], total: 0 });
  };

  // 간단한 토스트 메시지 (임시)
  const showToast = (message) => {
    // 실제로는 Toast 컴포넌트를 사용하는 것이 좋습니다
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #2563eb;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'order' && (
        <main className="main-content">
          <div className="menu-grid">
            {MENU_DATA.map(product => (
              <MenuCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="cart-spacer" />
        </main>
      )}
      
      {currentPage === 'admin' && (
        <AdminPage 
          orders={orders}
          onStatusChange={(orderId, newStatus) => {
            setOrders(prev =>
              prev.map(order =>
                order.orderId === orderId
                  ? { ...order, status: newStatus }
                  : order
              )
            );
          }}
        />
      )}
      
      {currentPage === 'order' && (
        <CartPanel
          cart={cart}
          onRemoveItem={handleRemoveItem}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onOrder={handleOrder}
        />
      )}
    </div>
  );
}

export default App;
