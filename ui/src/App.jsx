import { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import CartPanel from './components/CartPanel';
import AdminPage from './pages/AdminPage';
import Toast from './components/Toast';
import { menuApi, orderApi } from './services/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [menuData, setMenuData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // 메뉴 데이터 로드
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const data = await menuApi.getMenuList();
        
        // 메뉴 데이터 설정
        setMenuData(data.items || []);
        
        // 재고 데이터 추출
        const stockData = (data.items || []).map(item => ({
          productId: item.id,
          name: item.name,
          stock: item.stock || 0
        }));
        setInventory(stockData);
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
        showToast('메뉴를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

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
  const handleOrder = async () => {
    if (cart.items.length === 0) return;
    
    try {
      // API 요청 데이터 준비
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          selectedOptionIds: item.selectedOptions.map(opt => opt.id),
          quantity: item.quantity
        })),
        total: cart.total
      };
      
      // 백엔드 API로 주문 생성
      const result = await orderApi.createOrder(orderData);
      
      showToast('주문이 완료되었습니다!');
      
      // 장바구니 초기화
      setCart({ items: [], total: 0 });
      
      // 관리자 화면으로 전환 시 주문 목록 새로고침
      if (currentPage === 'admin') {
        // AdminPage 컴포넌트가 자체적으로 새로고침하도록 키 변경
        setCurrentPage('admin');
      }
    } catch (error) {
      console.error('주문 생성 실패:', error);
      showToast(error.message || '주문 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 재고 업데이트 콜백 (AdminPage에서 재고 변경 시 호출)
  const handleStockUpdate = () => {
    // 메뉴 데이터 새로고침하여 재고 동기화
    const fetchMenuData = async () => {
      try {
        const data = await menuApi.getMenuList();
        setMenuData(data.items || []);
        const stockData = (data.items || []).map(item => ({
          productId: item.id,
          name: item.name,
          stock: item.stock || 0
        }));
        setInventory(stockData);
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
      }
    };
    fetchMenuData();
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>메뉴를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <div className="menu-grid">
                {menuData.map(product => {
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
            </>
          )}
        </main>
      )}
      
      {currentPage === 'admin' && (
        <AdminPage 
          onStockUpdate={handleStockUpdate}
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
