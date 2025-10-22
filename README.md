# ☕ COZY - 커피 주문 앱

간단하고 직관적인 커피 주문 및 관리 웹 애플리케이션

## 🚀 프로젝트 개요

사용자가 커피 메뉴를 선택하고 주문할 수 있으며, 관리자가 재고와 주문을 관리할 수 있는 풀스택 웹 애플리케이션입니다.

### ✨ 주요 기능

#### 👥 사용자 기능
- 메뉴 탐색 및 조회
- 옵션 선택 (샷 추가, 시럽 추가 등)
- 장바구니 관리
- 실시간 재고 확인
- 주문 생성

#### 🔧 관리자 기능
- 대시보드 메트릭 (주문 통계)
- 재고 관리 (증감)
- 주문 상태 관리 (NEW → ACCEPTED → IN_PROGRESS → DONE)
- 자동 재고 차감

## 🛠️ 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **CSS3** - 스타일링

### 백엔드
- **Node.js 18+** - 런타임
- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **pg** - PostgreSQL 클라이언트

### 개발 도구
- **nodemon** - 백엔드 핫 리로드
- **dotenv** - 환경 변수 관리
- **cors** - CORS 설정

## 📁 프로젝트 구조

```
order-app/
├── ui/                      # 프론트엔드 (React + Vite)
│   ├── public/             # 정적 파일 (이미지)
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 서비스
│   │   └── App.jsx         # 메인 앱 컴포넌트
│   └── package.json
│
├── server/                  # 백엔드 (Express.js)
│   ├── src/
│   │   ├── config/         # 데이터베이스 설정
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── models/         # 데이터 모델
│   │   ├── routes/         # API 라우트
│   │   └── app.js          # Express 앱 설정
│   ├── scripts/            # DB 초기화 스크립트
│   └── package.json
│
├── docs/                    # 문서
│   └── PRD.md              # 프로덕트 요구사항 문서
│
├── DEPLOYMENT.md           # 배포 가이드
└── README.md               # 이 파일
```

## 🏃 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 18 이상
- PostgreSQL 12 이상
- npm 또는 yarn

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/coffee-order-app.git
cd coffee-order-app
```

### 2. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb coffee_order_db

# 테이블 생성 및 초기 데이터 삽입
psql -d coffee_order_db -f server/scripts/init-db.sql
```

### 3. 백엔드 설정

```bash
cd server

# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 PostgreSQL 비밀번호 등을 설정

# 개발 서버 실행
npm run dev
```

백엔드 서버: http://localhost:3000

### 4. 프론트엔드 설정

```bash
cd ui

# 패키지 설치
npm install

# 환경 변수 설정 (이미 설정되어 있음)
# .env 파일 확인: VITE_API_URL=http://localhost:3000/api

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: http://localhost:5173

## 🧪 테스트

### 수동 테스트

1. 브라우저에서 http://localhost:5173 접속
2. 주문하기 화면에서 메뉴 선택 및 주문
3. 관리자 탭으로 이동하여 주문 확인
4. 재고 관리 및 주문 상태 변경 테스트

### API 테스트

```bash
# 메뉴 조회
curl http://localhost:3000/api/menu

# 주문 생성
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"americano-hot","selectedOptionIds":[],"quantity":1}],"total":4000}'

# 관리자 메트릭 조회
curl http://localhost:3000/api/admin/metrics
```

## 🌐 배포

Render.com에 배포하는 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

### 배포 URL (예시)

- **프론트엔드**: https://coffee-order-app.onrender.com
- **백엔드 API**: https://coffee-order-api.onrender.com

## 📊 데이터베이스 스키마

### 주요 테이블

- `menus` - 커피 메뉴 정보
- `options` - 추가 옵션 (샷 추가, 시럽 등)
- `menu_options` - 메뉴와 옵션 매핑
- `orders` - 주문 정보
- `order_items` - 주문 항목
- `order_item_options` - 주문 항목의 옵션

자세한 스키마는 `server/scripts/init-db.sql` 참고

## 🤝 기여

이 프로젝트는 학습 목적으로 제작되었습니다.

## 📄 라이선스

MIT License

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

Made with ☕ and ❤️

