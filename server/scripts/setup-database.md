# PostgreSQL 데이터베이스 설정 가이드

## 방법 1: pgAdmin 사용 (GUI)

### 1단계: 데이터베이스 생성
1. **pgAdmin 4** 실행
2. 왼쪽 트리에서 **PostgreSQL** 서버 선택
3. **Databases** 우클릭 → **Create** → **Database...**
4. Database 이름: `coffee_order_db`
5. **Save** 클릭

### 2단계: SQL 스크립트 실행
1. 생성한 `coffee_order_db` 데이터베이스 선택
2. 상단 메뉴에서 **Tools** → **Query Tool** 클릭
3. `server/scripts/init-db.sql` 파일 열기
4. 전체 스크립트 선택 후 **실행(F5)** 버튼 클릭
5. 성공 메시지 확인

---

## 방법 2: 명령줄 사용 (CMD/PowerShell)

### 1단계: PostgreSQL bin 폴더로 이동
```bash
# PostgreSQL 설치 경로 예시 (버전에 따라 다름)
cd "C:\Program Files\PostgreSQL\16\bin"
# 또는
cd "C:\Program Files\PostgreSQL\15\bin"
# 또는
cd "C:\Program Files\PostgreSQL\14\bin"
```

### 2단계: 데이터베이스 생성
```bash
psql -U postgres
```
비밀번호 입력 후:
```sql
CREATE DATABASE coffee_order_db;
\q
```

### 3단계: SQL 스크립트 실행
```bash
psql -U postgres -d coffee_order_db -f "C:\order-app\server\scripts\init-db.sql"
```

---

## 방법 3: SQL Shell (psql) 사용

### 1단계: SQL Shell (psql) 실행
시작 메뉴에서 **SQL Shell (psql)** 검색 후 실행

### 2단계: 연결 정보 입력
```
Server [localhost]:           (Enter)
Database [postgres]:          (Enter)
Port [5432]:                  (Enter)
Username [postgres]:          (Enter)
Password for user postgres:   (비밀번호 입력)
```

### 3단계: 데이터베이스 생성
```sql
CREATE DATABASE coffee_order_db;
```

### 4단계: 데이터베이스 연결
```sql
\c coffee_order_db
```

### 5단계: SQL 파일 실행
```sql
\i 'C:/order-app/server/scripts/init-db.sql'
```
※ 주의: 경로는 `/` (슬래시) 사용

---

## 데이터베이스 연결 확인

### 테이블 목록 확인
```sql
\dt
```

다음 테이블들이 보여야 합니다:
- menus
- options
- menu_options
- orders
- order_items
- order_item_options

### 데이터 확인
```sql
SELECT * FROM menus;
SELECT * FROM options;
```

6개의 메뉴와 5개의 옵션이 보여야 합니다.

---

## .env 파일 설정

`server/.env` 파일을 열어 PostgreSQL 비밀번호를 설정하세요:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=여기에_실제_비밀번호_입력
```

---

## 문제 해결

### 1. "psql: command not found" 오류
→ PostgreSQL bin 폴더를 PATH에 추가하거나 pgAdmin 사용

### 2. "database already exists" 오류
→ 데이터베이스가 이미 존재합니다. 삭제 후 재생성:
```sql
DROP DATABASE coffee_order_db;
CREATE DATABASE coffee_order_db;
```

### 3. 연결 오류
→ PostgreSQL 서비스가 실행 중인지 확인:
- Windows: 서비스(services.msc)에서 'postgresql' 확인
- 또는 pgAdmin에서 서버 연결 확인

---

## 완료 후 확인

서버 실행 테스트:
```bash
cd C:\order-app\server
npm run dev
```

정상 작동 시 다음 메시지가 표시됩니다:
```
✅ Connected to PostgreSQL database
🚀 Server is running on port 3000
📡 API endpoint: http://localhost:3000/api
```

