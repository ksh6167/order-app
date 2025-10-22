# Render.com 배포 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [GitHub 저장소 준비](#1-github-저장소-준비)
3. [PostgreSQL 데이터베이스 배포](#2-postgresql-데이터베이스-배포)
4. [백엔드 API 배포](#3-백엔드-api-배포)
5. [프론트엔드 배포](#4-프론트엔드-배포)
6. [배포 후 테스트](#5-배포-후-테스트)
7. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 필요한 계정
- ✅ GitHub 계정
- ✅ Render.com 계정 (https://render.com)

### 로컬 환경 체크
- ✅ Git 설치 확인: `git --version`
- ✅ 프론트엔드 빌드 테스트: `cd ui && npm run build`
- ✅ 백엔드 동작 확인: `cd server && npm start`

---

## 1. GitHub 저장소 준비

### 1.1 Git 초기화 및 커밋

```bash
# 프로젝트 루트에서
git init
git add .
git commit -m "Initial commit: Coffee ordering app with frontend, backend, and database"
```

### 1.2 GitHub 저장소 생성
1. GitHub(https://github.com)에 로그인
2. "New repository" 클릭
3. 저장소 이름: `coffee-order-app` (또는 원하는 이름)
4. Public 또는 Private 선택
5. **Do NOT initialize with README** (이미 로컬에 코드가 있으므로)
6. "Create repository" 클릭

### 1.3 원격 저장소 연결 및 푸시

```bash
git remote add origin https://github.com/YOUR_USERNAME/coffee-order-app.git
git branch -M main
git push -u origin main
```

---

## 2. PostgreSQL 데이터베이스 배포

### 2.1 Render.com에서 PostgreSQL 생성

1. Render Dashboard(https://dashboard.render.com) 접속
2. "New +" 버튼 → "PostgreSQL" 선택
3. 설정:
   - **Name**: `coffee-order-db`
   - **Database**: `coffee_order_db`
   - **User**: `postgres` (자동 생성)
   - **Region**: 가장 가까운 지역 선택 (예: Singapore)
   - **Plan**: Free (또는 Starter)
4. "Create Database" 클릭
5. 생성 완료 후 **Internal Database URL** 복사 (나중에 사용)

### 2.2 데이터베이스 초기화

생성된 데이터베이스에 Connect를 클릭하여 PSQL Command를 복사한 후:

```bash
# 로컬에서 Render PostgreSQL에 연결
psql <PSQL_COMMAND_FROM_RENDER>

# 또는 SQL 파일 실행
psql <PSQL_COMMAND> < server/scripts/init-db.sql
```

**또는** Render Dashboard에서:
1. 생성된 Database 클릭
2. "Connect" 탭
3. "External Database URL" 사용하여 pgAdmin이나 DBeaver로 연결
4. `server/scripts/init-db.sql` 파일 실행

---

## 3. 백엔드 API 배포

### 3.1 백엔드 빌드 스크립트 준비

`server/package.json`에 다음 스크립트가 있는지 확인:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3.2 Render에서 Web Service 생성

1. Render Dashboard → "New +" → "Web Service"
2. "Connect a repository" → GitHub 연동
3. 저장소 선택: `coffee-order-app`
4. 설정:
   - **Name**: `coffee-order-api`
   - **Region**: 데이터베이스와 같은 지역
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.3 환경 변수 설정

"Environment" 섹션에서 다음 환경 변수 추가:

```
NODE_ENV=production
PORT=3000
DB_HOST=<Render PostgreSQL Internal Host>
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=<Render PostgreSQL Password>
```

**또는 한 번에:**

```
DATABASE_URL=<Internal Database URL from Step 2.1>
```

그리고 `server/src/config/database.js`를 다음과 같이 수정:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

5. "Create Web Service" 클릭

### 3.4 배포 확인

- 배포 로그 확인
- 서비스 URL 확인 (예: `https://coffee-order-api.onrender.com`)
- API 테스트: `https://coffee-order-api.onrender.com/api/menu`

---

## 4. 프론트엔드 배포

### 4.1 프론트엔드 빌드 설정

`ui/package.json`에 빌드 스크립트 확인:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4.2 환경 변수 파일 업데이트

`ui/.env.production` 파일 생성:

```
VITE_API_URL=https://coffee-order-api.onrender.com/api
```

### 4.3 Render에서 Static Site 생성

1. Render Dashboard → "New +" → "Static Site"
2. 저장소 선택: `coffee-order-app`
3. 설정:
   - **Name**: `coffee-order-app`
   - **Branch**: `main`
   - **Root Directory**: `ui`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 4.4 환경 변수 설정

"Environment" 섹션에서:

```
VITE_API_URL=https://coffee-order-api.onrender.com/api
```

4. "Create Static Site" 클릭

### 4.5 배포 확인

- 배포 완료 후 URL 확인 (예: `https://coffee-order-app.onrender.com`)
- 브라우저에서 접속하여 테스트

---

## 5. 배포 후 테스트

### 5.1 기능 테스트 체크리스트

- [ ] 메뉴 목록 로드 (이미지 포함)
- [ ] 장바구니 추가
- [ ] 주문 생성
- [ ] 관리자 화면 접속
- [ ] 재고 관리
- [ ] 주문 상태 변경

### 5.2 브라우저 콘솔 확인

- CORS 에러가 없는지 확인
- API 호출이 성공하는지 확인

---

## 트러블슈팅

### 문제 1: CORS 에러

**증상**: 브라우저 콘솔에 CORS 에러

**해결**: `server/src/app.js`에서 CORS 설정 확인

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://coffee-order-app.onrender.com'  // 프론트엔드 URL
  ]
}));
```

### 문제 2: 데이터베이스 연결 실패

**증상**: 백엔드 로그에 "Connection refused" 또는 "password authentication failed"

**해결**:
1. Render Dashboard에서 Database URL이 정확한지 확인
2. SSL 설정이 올바른지 확인
3. 환경 변수가 제대로 설정되었는지 확인

### 문제 3: 프론트엔드에서 API 호출 실패

**증상**: "Failed to fetch" 에러

**해결**:
1. `VITE_API_URL` 환경 변수가 올바른지 확인
2. 백엔드 서비스가 정상 작동하는지 확인
3. 브라우저에서 직접 API URL 접속 테스트

### 문제 4: 이미지가 표시되지 않음

**증상**: 메뉴 이미지가 보이지 않음

**해결**:
1. `ui/public` 폴더의 이미지가 Git에 커밋되었는지 확인
2. 빌드 시 `public` 폴더가 포함되는지 확인

---

## 추가 정보

### Render 무료 플랜 제한사항
- **PostgreSQL**: 90일 후 만료 (유료 전환 필요)
- **Web Service**: 15분 동안 요청이 없으면 슬립 모드 (첫 요청 시 느림)
- **Static Site**: 무제한 무료

### 자동 배포 설정
- GitHub에 푸시하면 자동으로 Render가 재배포
- `main` 브랜치에 푸시 시 자동 배포됨

### 커스텀 도메인 설정
1. Render Dashboard에서 서비스 선택
2. "Settings" → "Custom Domain"
3. 도메인 추가 및 DNS 설정

---

## 참고 자료

- [Render Documentation](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Static Sites on Render](https://render.com/docs/static-sites)

