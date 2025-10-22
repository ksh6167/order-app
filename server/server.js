const path = require('path');
const dotenv = require('dotenv');

// .env 파일 경로 명시 (로컬 개발 환경)
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '.env');
  dotenv.config({ path: envPath });
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});

