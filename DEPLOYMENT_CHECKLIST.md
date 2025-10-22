# 🚀 Render.com 배포 체크리스트

## ✅ 배포 전 체크리스트

### 📝 코드 준비
- [ ] 모든 변경사항 커밋 완료
- [ ] `.gitignore`에 `.env` 파일 포함 확인
- [ ] GitHub 저장소 생성 및 푸시 완료

### 🗄️ 데이터베이스 (PostgreSQL)
- [ ] Render에서 PostgreSQL 생성
- [ ] Internal Database URL 복사
- [ ] `init-db.sql` 실행하여 테이블 생성
- [ ] 초기 데이터(메뉴, 옵션) 확인

### 🔧 백엔드 (Express API)
- [ ] Render에서 Web Service 생성
- [ ] Root Directory: `server` 설정
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] 환경 변수 설정:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL=<Render PostgreSQL Internal URL>`
  - [ ] `FRONTEND_URL=<프론트엔드 URL>`
- [ ] 배포 완료 확인
- [ ] API 테스트: `https://your-api.onrender.com/api/menu`

### 🎨 프론트엔드 (React Static Site)
- [ ] Render에서 Static Site 생성
- [ ] Root Directory: `ui` 설정
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] 환경 변수 설정:
  - [ ] `VITE_API_URL=<백엔드 API URL>/api`
- [ ] 배포 완료 확인
- [ ] 브라우저에서 접속 테스트

---

## 🔄 배포 순서 (요약)

```
1️⃣ GitHub 저장소 생성 및 푸시
   ↓
2️⃣ Render PostgreSQL 생성 (DB URL 복사)
   ↓
3️⃣ 백엔드 API 배포 (DB URL 환경변수 설정)
   ↓
4️⃣ 프론트엔드 배포 (API URL 환경변수 설정)
   ↓
5️⃣ 통합 테스트
```

---

## 🧪 배포 후 테스트

### API 테스트
```bash
# 헬스 체크
curl https://your-api.onrender.com/health

# 메뉴 조회
curl https://your-api.onrender.com/api/menu

# 재고 조회
curl https://your-api.onrender.com/api/admin/stock
```

### 기능 테스트
- [ ] 메뉴 목록 로드
- [ ] 메뉴 이미지 표시
- [ ] 장바구니 추가
- [ ] 주문 생성
- [ ] 관리자 페이지 접속
- [ ] 재고 관리 (증감)
- [ ] 주문 상태 변경
  - [ ] NEW → ACCEPTED (재고 차감 확인)
  - [ ] ACCEPTED → IN_PROGRESS
  - [ ] IN_PROGRESS → DONE

---

## 🐛 트러블슈팅

### CORS 에러
```
❌ Access to fetch has been blocked by CORS policy
```
**해결**: 백엔드 환경변수에 `FRONTEND_URL` 설정 확인

### 데이터베이스 연결 실패
```
❌ Connection refused / password authentication failed
```
**해결**: `DATABASE_URL` 환경변수 확인 (Internal URL 사용)

### API 호출 실패
```
❌ Failed to fetch
```
**해결**: 프론트엔드 `VITE_API_URL` 환경변수 확인

### 이미지가 안 보임
```
❌ 404 Not Found for /americano-hot.jpg
```
**해결**: `ui/public` 폴더의 이미지가 Git에 커밋되었는지 확인

---

## 📞 Render.com 주요 URL

- **Dashboard**: https://dashboard.render.com
- **Docs**: https://render.com/docs
- **PostgreSQL Docs**: https://render.com/docs/databases

---

## 💡 유용한 팁

### 1. 자동 배포
- `main` 브랜치에 푸시하면 자동으로 재배포됩니다
- 배포 로그를 확인하여 에러를 파악할 수 있습니다

### 2. 무료 플랜 제한
- **PostgreSQL**: 90일 후 만료 (중요 데이터는 백업 필수)
- **Web Service**: 15분 비활성 시 슬립 모드 (첫 요청 느림)
- **Static Site**: 무제한 무료

### 3. 로그 확인
- Render Dashboard → 서비스 선택 → Logs 탭
- 실시간 로그 확인 가능

### 4. 환경 변수 업데이트
- Dashboard에서 Environment 섹션에서 수정
- 변경 후 자동으로 재배포됩니다

---

## ✨ 배포 완료!

축하합니다! 🎉

이제 다음 URL에서 앱을 확인할 수 있습니다:
- 프론트엔드: https://your-app.onrender.com
- 백엔드 API: https://your-api.onrender.com

배포가 완료되면 친구들과 공유해보세요! ☕

