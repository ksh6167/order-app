const express = require('express');
const cors = require('cors');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 임포트
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// 라우트 등록
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coffee Order API is running' });
});

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Requested resource not found'
    }
  });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

module.exports = app;

