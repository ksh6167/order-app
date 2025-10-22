const path = require('path');
const dotenv = require('dotenv');

// .env 파일 경로 명시
const envPath = path.resolve(__dirname, '.env');
console.log('📄 Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ Loaded', Object.keys(result.parsed || {}).length, 'environment variables');
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
});

