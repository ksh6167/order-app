# 🎨 프론트엔드 Render 배포 가이드

## 📋 배포 체크리스트

### ✅ 사전 준비
- [x] 백엔드 배포 완료
- [x] 백엔드 URL 확인: `https://order-app-backend-a2ez.onrender.com`
- [x] 환경 변수 설정 (`ui/.env.production`)
- [x] CORS 설정 업데이트 (백엔드)
- [ ] GitHub에 코드 푸시
- [ ] Render에서 Static Site 생성

---

## 1️⃣ 로컬에서 프로덕션 빌드 테스트

배포하기 전에 로컬에서 빌드가 정상적으로 되는지 확인합니다:

```bash
# ui 폴더로 이동
cd ui

# 프로덕션 빌드
npm run build

# 빌드 결과 확인 (dist 폴더 생성됨)
ls dist

# 빌드된 파일 미리보기 (선택사항)
npm run preview
```

### 빌드 성공 확인사항
- ✅ `dist` 폴더 생성됨
- ✅ `dist/index.html` 파일 존재
- ✅ `dist/assets/` 폴더에 JS, CSS 파일 존재
- ✅ `dist/americano-hot.jpg` 등 이미지 파일 존재

---

## 2️⃣ GitHub에 코드 푸시

### 현재 변경사항 확인

```bash
# 프로젝트 루트로 이동
cd ..

# 변경된 파일 확인
git status
```

### 커밋 및 푸시

```bash
# 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: Update frontend for Render deployment with backend URL"

# GitHub에 푸시
git push origin main
```

---

## 3️⃣ Render에서 Static Site 생성

### Step 1: Render Dashboard 접속
1. https://dashboard.render.com 접속
2. 로그인

### Step 2: Static Site 생성
1. **"New +"** 버튼 클릭
2. **"Static Site"** 선택
3. GitHub 저장소 연결 (처음이면 GitHub 계정 연동)
4. 저장소 선택: `your-username/order-app` (또는 실제 저장소 이름)

### Step 3: 설정

#### 기본 설정
```
Name: order-app-frontend
(또는 원하는 이름, 예: coffee-order-app)

Branch: main

Root Directory: ui
```

#### 빌드 설정
```
Build Command: npm install && npm run build

Publish Directory: dist
```

#### 환경 변수 (Environment Variables)
```
VITE_API_URL=https://order-app-backend-a2ez.onrender.com/api
```

**중요**: 환경 변수는 **반드시** 추가해야 합니다!

### Step 4: 배포 시작
1. **"Create Static Site"** 클릭
2. 배포 시작 (약 2-5분 소요)

---

## 4️⃣ 배포 완료 및 확인

### 배포 URL 확인
배포가 완료되면 다음과 같은 URL이 생성됩니다:
```
https://order-app-frontend.onrender.com
(실제 URL은 Name에 따라 다름)
```

### 기능 테스트

#### 1. 메뉴 로드 테스트
- [ ] 브라우저에서 프론트엔드 URL 접속
- [ ] 메뉴 목록이 표시되는지 확인
- [ ] 메뉴 이미지가 표시되는지 확인 (3개)
- [ ] 재고 상태가 올바른지 확인

#### 2. 주문 기능 테스트
- [ ] 메뉴 선택 및 옵션 추가
- [ ] 장바구니에 담기
- [ ] 수량 조절
- [ ] 주문 생성
- [ ] 토스트 메시지 확인

#### 3. 관리자 기능 테스트
- [ ] 관리자 탭으로 이동
- [ ] 대시보드 메트릭 표시
- [ ] 재고 현황 표시
- [ ] 주문 목록 표시
- [ ] 재고 증감 기능
- [ ] 주문 상태 변경 (NEW → ACCEPTED → IN_PROGRESS → DONE)
- [ ] 재고 자동 차감 확인

---

## 5️⃣ 백엔드 환경 변수 업데이트 (선택사항)

프론트엔드 URL을 알게 된 후, 백엔드 환경 변수에 추가할 수 있습니다:

### Render 백엔드 설정
1. Render Dashboard → 백엔드 서비스 선택
2. **"Environment"** 탭
3. 환경 변수 추가:
```
FRONTEND_URL=https://order-app-frontend.onrender.com
```
4. 저장 (자동 재배포됨)

**참고**: 현재 CORS 설정은 모든 `.onrender.com` 도메인을 허용하므로, 이 단계는 선택사항입니다.

---

## 🐛 트러블슈팅

### 문제 1: 빌드 실패

**증상**: Render에서 빌드 중 에러 발생

**해결**:
1. 로컬에서 `npm run build` 테스트
2. `package.json`의 dependencies 확인
3. Node.js 버전 호환성 확인

### 문제 2: 페이지는 뜨지만 메뉴가 안 보임

**증상**: 프론트엔드는 열리지만 메뉴 목록이 빈 상태

**해결**:
1. 브라우저 콘솔(F12) 확인
2. 네트워크 탭에서 API 호출 확인
3. `VITE_API_URL` 환경 변수가 올바른지 확인
4. 백엔드 URL이 정확한지 확인 (끝에 `/api` 포함)

### 문제 3: CORS 에러

**증상**: 브라우저 콘솔에 "Access to fetch has been blocked by CORS policy"

**해결**:
1. 백엔드가 정상 작동하는지 확인:
   ```bash
   curl https://order-app-backend-a2ez.onrender.com/health
   ```
2. 백엔드 CORS 설정 확인 (`server/src/app.js`)
3. 백엔드 로그 확인 (Render Dashboard → Logs)

### 문제 4: 이미지가 표시되지 않음

**증상**: 메뉴 이미지가 깨짐 또는 404 에러

**해결**:
1. `ui/public` 폴더의 이미지가 Git에 커밋되었는지 확인
2. 빌드 시 `public` 폴더가 복사되는지 확인 (Vite는 자동으로 복사함)
3. 이미지 URL 경로 확인 (절대 경로 `/americano-hot.jpg` 사용)

### 문제 5: 환경 변수가 적용되지 않음

**증상**: API 호출 URL이 잘못됨

**해결**:
1. Render Dashboard에서 환경 변수 재확인
2. 환경 변수 이름 확인 (`VITE_API_URL`은 `VITE_` 접두사 필수)
3. 환경 변수 변경 후 재배포 필요 (수동 재배포 버튼 클릭)

---

## 📊 배포 후 모니터링

### Render Dashboard에서 확인
- **Logs**: 빌드 및 배포 로그
- **Events**: 배포 이벤트 기록
- **Settings**: 환경 변수, 도메인 설정

### 자동 재배포
- GitHub의 `main` 브랜치에 푸시하면 자동으로 재배포됩니다
- 환경 변수를 변경하면 수동으로 재배포해야 합니다

---

## 🎉 배포 완료!

축하합니다! 프론트엔드 배포가 완료되었습니다!

### 최종 URL
- **프론트엔드**: https://order-app-frontend.onrender.com
- **백엔드 API**: https://order-app-backend-a2ez.onrender.com

### 다음 단계
1. ✅ 모든 기능 테스트 완료
2. ✅ 친구들과 공유
3. 📱 모바일에서도 테스트
4. 🎨 커스텀 도메인 연결 (선택사항)

---

## 💡 추가 팁

### 1. 커스텀 도메인 연결
Render에서 자신의 도메인을 연결할 수 있습니다:
1. Settings → Custom Domain
2. 도메인 추가 (예: coffee.yourdomain.com)
3. DNS 설정 (CNAME 레코드)

### 2. 성능 최적화
- Render의 CDN이 자동으로 적용됩니다
- 이미지 최적화 (WebP 포맷 사용 권장)
- Lazy loading 구현

### 3. 분석 도구 추가
- Google Analytics
- Hotjar (사용자 행동 분석)

---

## 📞 도움이 필요하신가요?

- [Render Static Sites 문서](https://render.com/docs/static-sites)
- [Vite 빌드 문서](https://vitejs.dev/guide/build.html)
- [React 배포 가이드](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

