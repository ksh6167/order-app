import './Header.css';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="brand">COZY</h1>
        <nav className="nav">
          <button
            className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onNavigate('order')}
          >
            주문하기
          </button>
          <button
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

