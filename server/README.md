# Coffee Order API Server

커피 주문 앱의 백엔드 API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL

## 시작하기

### 1. 환경 변수 설정

`.env` 파일을 수정하여 데이터베이스 연결 정보를 입력하세요.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 2. 데이터베이스 설정

PostgreSQL 데이터베이스를 생성하고 스키마를 초기화하세요.

```bash
# 데이터베이스 생성
createdb coffee_order_db

# 스키마 초기화 (추후 scripts/init-db.sql 실행)
psql -d coffee_order_db -f scripts/init-db.sql
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 메뉴 관련
- `GET /api/menu` - 메뉴 목록 조회

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderId` - 주문 조회

### 관리자 관련
- `GET /api/admin/metrics` - 메트릭 조회
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
│   ├── models/               # (추후 추가)
│   └── app.js                # Express 앱 설정
├── scripts/
│   └── init-db.sql           # DB 스키마 및 시드 데이터
├── .env                      # 환경 변수
├── .gitignore
├── package.json
├── server.js                 # 서버 진입점
└── README.md
```

## 개발 상태

현재 기본 구조만 설정되어 있으며, 각 컨트롤러의 TODO 부분을 구현해야 합니다.

