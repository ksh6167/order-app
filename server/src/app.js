const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
// CORS 설정 - 프로덕션 환경에서 프론트엔드 도메인 허용
const corsOptions = {
  origin: function (origin, callback) {
    // 로컬 개발 환경
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    // 프로덕션 환경: FRONTEND_URL 또는 Render.com 도메인
    if (process.env.NODE_ENV === 'production') {
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }
      // Render.com의 모든 도메인 허용
      if (origin && origin.includes('.onrender.com')) {
        allowedOrigins.push(origin);
      }
    }
    
    // origin이 없는 경우 (같은 도메인) 또는 허용된 origin인 경우
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coffee Order API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.'
    }
  });
});

module.exports = app;

