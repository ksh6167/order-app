# 🚀 프론트엔드 배포 빠른 가이드

## ✅ 사전 확인
- [x] 백엔드 배포 완료: `https://order-app-backend-a2ez.onrender.com`
- [x] 환경 변수 설정 완료 (`ui/.env.production`)
- [x] 로컬 빌드 테스트 완료 ✅

---

## 📝 배포 단계 (3단계)

### 1️⃣ GitHub에 푸시

```bash
# 변경사항 확인
git status

# 커밋 및 푸시
git add .
git commit -m "feat: Prepare frontend for Render deployment"
git push origin main
```

---

### 2️⃣ Render에서 Static Site 생성

**Dashboard**: https://dashboard.render.com

#### 설정값

| 항목 | 값 |
|------|-----|
| **Type** | Static Site |
| **Name** | order-app-frontend (원하는 이름) |
| **Branch** | main |
| **Root Directory** | `ui` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### 환경 변수

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://order-app-backend-a2ez.onrender.com/api` |

**중요**: 환경 변수를 반드시 추가하세요!

---

### 3️⃣ 배포 확인

배포 완료 후 (약 2-5분):
1. 생성된 URL 접속 (예: `https://order-app-frontend.onrender.com`)
2. 메뉴 목록 확인
3. 주문 기능 테스트
4. 관리자 화면 테스트

---

## 🎉 완료!

### 최종 URL
- **프론트엔드**: `https://[your-app-name].onrender.com`
- **백엔드**: `https://order-app-backend-a2ez.onrender.com`

### 자동 재배포
GitHub `main` 브랜치에 푸시하면 자동으로 재배포됩니다!

---

## 🐛 문제 해결

**메뉴가 안 보이면?**
→ 브라우저 콘솔(F12) 확인 → 환경 변수 재확인

**이미지가 안 보이면?**
→ `ui/public` 폴더 파일들이 Git에 커밋되었는지 확인

**CORS 에러?**
→ 백엔드 `server/src/app.js`의 CORS 설정이 업데이트되었는지 확인

더 자세한 내용은 `FRONTEND_DEPLOYMENT.md` 참고!

