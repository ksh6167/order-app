const path = require('path');
const dotenv = require('dotenv');

// .env 파일 경로 명시
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

console.log('🔍 Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'Set (Render DB)' : 'Not set',
  DB_HOST: process.env.DB_HOST || 'localhost',
  EnvFileLoaded: result.error ? 'Failed' : 'Success'
});

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});

