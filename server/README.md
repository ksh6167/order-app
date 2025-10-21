# Coffee Order API Server

커피 주문 앱의 백엔드 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL

## 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 데이터베이스 정보를 설정하세요.

```bash
cp .env.example .env
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 데이터베이스 초기화

PostgreSQL이 설치되어 있어야 합니다.

```bash
# PostgreSQL 데이터베이스 생성
createdb coffee_order_db

# 스키마 및 시드 데이터 실행
psql -U postgres -d coffee_order_db -f scripts/init-db.sql
```

### 4. 서버 실행

개발 모드 (nodemon 사용):
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 메뉴

- `GET /api/menu` - 메뉴 목록 조회

### 주문

- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderId` - 주문 조회

### 관리자

- `GET /api/admin/metrics` - 대시보드 메트릭
- `GET /api/admin/stock` - 재고 목록 조회
- `PATCH /api/admin/stock/:productId` - 재고 수정
- `GET /api/admin/orders` - 주문 목록 조회
- `POST /api/admin/orders/:orderId/accept` - 주문 접수
- `POST /api/admin/orders/:orderId/start` - 제조 시작
- `POST /api/admin/orders/:orderId/complete` - 제조 완료

## 프로젝트 구조

```
server/
├── src/
│   ├── config/
│   │   └── database.js       # DB 연결 설정
│   ├── routes/
│   │   ├── menu.js           # 메뉴 라우트
│   │   ├── orders.js         # 주문 라우트
│   │   └── admin.js          # 관리자 라우트
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── Menu.js
│   │   └── Order.js
│   └── app.js                # Express 앱 설정
├── scripts/
│   └── init-db.sql           # DB 초기화 스크립트
├── .env                      # 환경 변수 (git에 포함되지 않음)
├── .env.example              # 환경 변수 템플릿
├── package.json
└── server.js                 # 서버 진입점
```

## 헬스 체크

서버 상태 확인:
```bash
curl http://localhost:3000/health
```

