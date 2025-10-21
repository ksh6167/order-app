import './MetricsBar.css';

function MetricsBar({ metrics }) {
  return (
    <div className="metrics-bar">
      <h2 className="section-title">관리자 대시보드</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">총 주문</div>
          <div className="metric-value">{metrics.total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">주문 접수</div>
          <div className="metric-value">{metrics.accepted}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">제조 중</div>
          <div className="metric-value">{metrics.inProgress}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">제조 완료</div>
          <div className="metric-value">{metrics.done}</div>
        </div>
      </div>
    </div>
  );
}

export default MetricsBar;

