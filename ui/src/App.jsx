import { useState } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import CartPanel from './components/CartPanel';
import AdminPage from './pages/AdminPage';
import Toast from './components/Toast';
import './App.css';

// 메뉴 데이터
const MENU_DATA = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    price: 4000,
    description: '깊고 진한 에스프레소에 시원한 얼음을 더한 클래식 커피',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '진한 에스프레소 샷에 뜨거운 물을 더한 따뜻한 커피',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'caffe-latte',
    name: '카페라떼',
    price: 5000,
    description: '부드러운 스팀 우유와 에스프레소가 어우러진 인기 메뉴',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'syrup', name: '시럽 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    price: 5000,
    description: '부드러운 우유 거품과 에스프레소의 완벽한 조화',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'cinnamon', name: '시나몬 추가', priceDelta: 0 }
    ]
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼',
    price: 5500,
    description: '달콤한 바닐라 시럽과 부드러운 우유가 어우러진 라떼',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'whipped-cream', name: '휘핑크림 추가', priceDelta: 500 }
    ]
  },
  {
    id: 'caramel-macchiato',
    name: '캬라멜 마키아또',
    price: 6000,
    description: '달콤한 캬라멜 드리즐과 에스프레소의 환상적인 조합',
    options: [
      { id: 'extra-shot', name: '샷 추가', priceDelta: 500 },
      { id: 'extra-caramel', name: '캬라멜 시럽 추가', priceDelta: 500 }
    ]
  }
];

// 초기 재고 데이터
const INITIAL_INVENTORY = [
  { productId: 'americano-ice', name: '아메리카노(ICE)', stock: 15 },
  { productId: 'americano-hot', name: '아메리카노(HOT)', stock: 15 },
  { productId: 'caffe-latte', name: '카페라떼', stock: 10 },
  { productId: 'cappuccino', name: '카푸치노', stock: 8 },
  { productId: 'vanilla-latte', name: '바닐라 라떼', stock: 3 },
  { productId: 'caramel-macchiato', name: '캬라멜 마키아또', stock: 0 }
];

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [orders, setOrders] = useState([]);
  const [orderIdCounter, setOrderIdCounter] = useState(1);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [toastMessage, setToastMessage] = useState(null);

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
    
    // 주문 목록에 추가 (오래된 순서로 정렬되도록 끝에 추가)
    setOrders(prev => [...prev, newOrder]);
    setOrderIdCounter(prev => prev + 1);
    
    showToast('주문이 완료되었습니다!');
    
    // 장바구니 초기화
    setCart({ items: [], total: 0 });
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

  // 주문 상태 변경 (재고 차감 포함)
  const handleStatusChange = (orderId, newStatus) => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    // ACCEPTED로 변경 시 재고 차감
    if (newStatus === 'ACCEPTED') {
      // 재고 확인
      let hasEnoughStock = true;
      const stockChanges = {};

      for (const item of order.items) {
        const currentStock = inventory.find(inv => inv.productId === item.productId);
        if (!currentStock || currentStock.stock < item.quantity) {
          hasEnoughStock = false;
          showToast(`재고 부족: ${item.name}의 재고가 부족합니다`);
          return;
        }
        stockChanges[item.productId] = (stockChanges[item.productId] || 0) + item.quantity;
      }

      if (!hasEnoughStock) return;

      // 재고 차감
      setInventory(prev =>
        prev.map(item =>
          stockChanges[item.productId]
            ? { ...item, stock: item.stock - stockChanges[item.productId] }
            : item
        )
      );
    }

    // 주문 상태 변경
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    showToast('상태가 변경되었습니다');
  };

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToastMessage(message);
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'order' && (
        <main className="main-content">
          <div className="menu-grid">
            {MENU_DATA.map(product => {
              const stock = inventory.find(inv => inv.productId === product.id);
              return (
                <MenuCard
                  key={product.id}
                  product={product}
                  stock={stock?.stock || 0}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
          <div className="cart-spacer" />
        </main>
      )}
      
      {currentPage === 'admin' && (
        <AdminPage 
          orders={orders}
          inventory={inventory}
          onStatusChange={handleStatusChange}
          onUpdateStock={handleUpdateStock}
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
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;
