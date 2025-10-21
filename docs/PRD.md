# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트 명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 키피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프론트엔드 : HTML, CSS, 리액트, 자바스크립트
- 백엔드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프론트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 화면 사양

### 4.1 주문하기 화면(PRD)

- **목표**: 사용자가 메뉴를 탐색하고 옵션을 선택해 장바구니에 담은 뒤 주문을 생성할 수 있게 한다.
- **대상 사용자**: 매장 내 키오스크/태블릿 사용자, 웹 브라우저 사용자.
- **성공 정의**: 장바구니에 1개 이상 항목이 담기고, 총액이 정확히 계산되며, 주문 생성 요청이 성공한다.

#### 4.1.1 레이아웃(와이어프레임 기준)
- **헤더 바**
  - 좌측: 브랜드 텍스트 `COZY`
  - 우측: 네비 버튼 `주문하기`(현재 페이지 강조), `관리자`
  - 헤더는 상단 고정(sticky) 아님(기본 스크롤). 향후 필요 시 고정 가능.
- **메뉴 그리드**
  - 3열 카드 그리드(데스크톱 기준). 카드 폭은 그리드에 맞춤, 카드간 간격 24px.
  - 각 카드 구성: 이미지 영역(placeholder 가능), 메뉴명, 가격, 간단 설명, 옵션 체크박스, `담기` 버튼.
- **장바구니 패널**
  - 페이지 하단에 고정된 카드 형태의 영역.
  - 좌측: 장바구니 항목 리스트(메뉴명, 옵션 표시, 수량 `x n`).
  - 우측: 총 금액, `주문하기` 버튼.

#### 4.1.2 컴포넌트 사양
- **메뉴 카드(MenuCard)**
  - 데이터: `id`, `name`, `price`, `description`, `imageUrl`, `options[]`.
  - 옵션(예시): `샷 추가(+500원)`, `시럽 추가(+0원)` → 체크박스 UI.
  - 상호작용:
    - 체크박스 선택/해제 시 카드 내부 상태로만 유지.
    - `담기` 클릭 시 현재 선택 옵션을 포함한 항목이 장바구니에 1개 추가.
    - 동일 메뉴 + 동일 옵션 조합일 경우 기존 라인과 병합되어 수량 +1.
- **장바구니(CartPanel)**
  - 항목 라인 표시: `메뉴명 (옵션 요약)` + `x 수량` + 라인금액.
  - 조작: 각 항목 `삭제` 아이콘 제공(수량 1인 항목 삭제, 수량 N은 라인 삭제로 단순화; 수량 증감은 MVP에서 제외, 동일 항목 재담기로 증가).
  - 하단 합계 영역: `총 금액` 표시, `주문하기` 버튼.
  - 비어 있을 때: 빈 상태 메시지(`장바구니가 비어 있습니다`)와 비활성화된 `주문하기` 버튼.

#### 4.1.3 동작/로직
- **가격 계산**
  - `itemUnitPrice = basePrice + Σ(option.priceDelta)`
  - `lineTotal = itemUnitPrice * quantity`
  - `cartTotal = Σ(lineTotal)`
  - 통화 표기: 천단위 구분 + `원` 접미사(예: `12,500원`).
- **담기 규칙**
  - 담기 시 토스트/스낵바로 피드백 제공(`담겼습니다`).
  - 카드의 체크박스는 담기 후 초기화.
- **주문 버튼 상태**
  - 장바구니가 비어 있으면 비활성화.
  - 요청 진행 중에는 로딩 스피너와 함께 비활성화.
- **에러 처리**
  - 네트워크/서버 에러 시 토스트로 안내(`주문 생성에 실패했습니다. 다시 시도해 주세요`).

#### 4.1.4 API 계약(초안)
- 메뉴 조회
  - Method/Path: `GET /api/menu`
  - Response(예시)
    ```json
    {
      "items": [
        {
          "id": "americano-ice",
          "name": "아메리카노(ICE)",
          "price": 4000,
          "description": "간단한 설명...",
          "imageUrl": null,
          "options": [
            { "id": "extra-shot", "name": "샷 추가", "priceDelta": 500 },
            { "id": "syrup", "name": "시럽 추가", "priceDelta": 0 }
          ]
        }
      ]
    }
    ```
- 주문 생성
  - Method/Path: `POST /api/orders`
  - Request Body(예시)
    ```json
    {
      "items": [
        {
          "productId": "americano-ice",
          "selectedOptionIds": ["extra-shot"],
          "quantity": 1
        },
        {
          "productId": "americano-hot",
          "selectedOptionIds": [],
          "quantity": 2
        }
      ],
      "total": 12500
    }
    ```
  - Response(예시)
    ```json
    { "orderId": "ord_20250101_0001", "status": "PENDING" }
    ```

#### 4.1.5 데이터 모델(프런트 기준)
- `Product`: `{ id, name, price, description?, imageUrl?, options: Option[] }`
- `Option`: `{ id, name, priceDelta }`
- `CartItem`: `{ productId, name, selectedOptions: Option[], quantity, unitPrice, lineTotal }`
- `Cart`: `{ items: CartItem[], total }`

#### 4.1.6 상태 관리/UX
- 초기 로드 시 메뉴 목록을 가져와 로컬 상태에 저장.
- 장바구니는 페이지 리프레시 시 소실(MVP). 추후 `localStorage` 영속화 옵션.
- 토스트 메시지: 담기 성공/실패, 주문 성공/실패.
- 포커스 이동: 담기 후 장바구니 영역으로 포커스 링 표시(접근성 강화).

#### 4.1.7 접근성(A11y)
- 버튼에는 시각적 라벨과 함께 스크린리더용 대체 텍스트 제공.
- 체크박스는 키보드로 탐색 가능해야 함(Tab/Space/Enter).
- 색 대비 WCAG AA 준수(텍스트 대비 ≥ 4.5:1 권장).

#### 4.1.8 반응형 가이드
- ≥ 1024px: 3열 그리드(와이어프레임 기준).
- 600–1023px: 2열.
- < 600px: 1열, 장바구니는 페이지 하단 전체 폭으로 스택.

#### 4.1.9 성능/품질
- 이미지 지연 로딩(`loading="lazy"`).
- 옵션/담기 클릭은 즉시 반응(<= 50ms 체감)하도록 메인 스레드 작업 최소화.
- API 실패 재시도 1회(지수 백오프 200ms).

#### 4.1.10 예외/제약
- 재고가 0인 메뉴는 `담기` 비활성화(서버에서 `isAvailable=false` 제공 시).
- 옵션이 없는 메뉴는 옵션 영역을 숨김.
- 가격은 정수 원화 기준, 부가세 포함가로 표기.

#### 4.1.11 수용 기준(AC)
- AC1: 메뉴 목록이 로드되고 각 카드에 이름/가격/담기 버튼이 보인다.
- AC2: 옵션 선택 후 `담기`를 클릭하면 동일 옵션 조합으로 장바구니 수량이 증가한다.
- AC3: 장바구니 총 금액이 옵션가를 포함해 정확히 계산된다.
- AC4: 장바구니가 비어 있으면 `주문하기`가 비활성화된다.
- AC5: `주문하기` 클릭 시 주문 생성 API가 호출되고 성공 시 성공 메시지가 표시된다.

### 4.2 관리자 화면(PRD)

- **목표**: 주문 흐름을 관리(접수→제조→완료)하고, 각 메뉴의 재고 수량을 실시간으로 조정한다.
- **대상 사용자**: 매장 직원/관리자.
- **성공 정의**: 신규 주문이 놓치지 않고 큐에 표시되고, 상태 전환과 재고 변경이 정확히 반영된다.

#### 4.2.1 레이아웃(와이어프레임 기준)
- **헤더 바**: 좌측 `COZY`, 우측 네비 `주문하기`, `관리자`(현재 강조).
- **관리자 대시보드 요약(Metrics)**
  - 텍스트로 카운트 표기: `총 주문`, `주문 접수`, `제조 중`, `제조 완료`.
  - 값은 실시간 갱신(폴링/푸시 중 택1, MVP는 폴링).
- **재고 현황(Inventory)**
  - 제품별 카드 리스트: 메뉴명, 현재 재고 수량, `+`, `-` 버튼.
  - `-`는 0 미만으로 내려가지 않음(비활성 처리).
- **주문 현황(Order Queue)**
  - 시간순 리스트(오래된→최신). 각 라인: `주문 시각`, `항목 요약`, `총액`, 그리고 상태 전환 버튼.
  - 상태별 버튼 라벨:
    - NEW(신규): `주문 접수`
    - ACCEPTED(접수): `제조 시작`
    - IN_PROGRESS(제조 중): `제조 완료`
    - DONE(완료): 버튼 없음/비활성 표시

#### 4.2.2 컴포넌트 사양
- **MetricsBar**
  - 데이터: `{ total, accepted, inProgress, done }`.
  - 로딩 시 스켈레톤 표시.
- **InventoryCard**
  - 데이터: `productId`, `name`, `stock`.
  - 상호작용: `+` 클릭 시 `stock + 1`, `-` 클릭 시 `stock - 1(최소 0)`.
  - 클릭 직후 낙관적 업데이트, 실패 시 롤백 및 토스트.
- **OrderRow**
  - 데이터: `orderId`, `createdAt`, `items[]`, `total`, `status`.
  - 버튼 클릭 시 상태 전환 API 호출. 성공 시 리스트에서 해당 행 상태 업데이트.

#### 4.2.3 동작/로직
- **주문 상태 머신**
  - `NEW → ACCEPTED → IN_PROGRESS → DONE`(단방향).
  - 각 전환 시각을 서버가 기록(감사/통계 용도).
- **재고 규칙**
  - 전환 시점: `ACCEPTED` 시 재고 차감(각 제품 수량 합산만큼). 차감 불가(부족) 시 전환 거부.
  - 관리자 수동 증감은 1회 클릭당 ±1. 최소 0, 최대 999(기본).
- **실시간 갱신**
  - MVP: 3초 간격 폴링(`metrics`, `orders`, `stock`).
  - 향후: 서버 푸시(WebSocket)로 교체 가능.
- **에러 처리**
  - API 실패 시 토스트(`요청에 실패했습니다. 잠시 후 다시 시도해 주세요`).
  - 재고 부족으로 접수 실패 시 명확한 메시지(`재고 부족으로 접수할 수 없습니다`).

#### 4.2.4 API 계약(초안)
- 메트릭 조회
  - `GET /api/admin/metrics`
  - Response 예시
    ```json
    { "total": 1, "accepted": 1, "inProgress": 0, "done": 0 }
    ```
- 재고 목록 조회
  - `GET /api/admin/stock`
  - Response 예시
    ```json
    {
      "items": [
        { "productId": "americano-ice", "name": "아메리카노(ICE)", "stock": 10 },
        { "productId": "americano-hot", "name": "아메리카노(HOT)", "stock": 10 }
      ]
    }
    ```
- 재고 증감
  - `PATCH /api/admin/stock/:productId`
  - Request Body: `{ "delta": 1 }` 또는 `{ "delta": -1 }`
  - Response: `{ "productId": "...", "stock": 11 }`
- 주문 목록 조회
  - `GET /api/admin/orders?status=NEW|ACCEPTED|IN_PROGRESS|DONE`
  - Response 예시
    ```json
    {
      "orders": [
        {
          "orderId": "ord_001",
          "createdAt": "2025-07-31T04:00:00Z",
          "items": [
            { "productId": "americano-ice", "name": "아메리카노(ICE)", "selectedOptions": ["샷 추가"], "quantity": 1, "lineTotal": 4500 }
          ],
          "total": 4500,
          "status": "NEW"
        }
      ]
    }
    ```
- 상태 전환
  - `POST /api/admin/orders/:orderId/accept`
  - `POST /api/admin/orders/:orderId/start`
  - `POST /api/admin/orders/:orderId/complete`
  - 공통 Response: `{ "orderId": "...", "status": "ACCEPTED|IN_PROGRESS|DONE" }`

#### 4.2.5 데이터 모델(프런트 기준)
- `StockItem`: `{ productId, name, stock }`
- `AdminMetrics`: `{ total, accepted, inProgress, done }`
- `AdminOrderItem`: `{ productId, name, selectedOptions: string[], quantity, lineTotal }`
- `AdminOrder`: `{ orderId, createdAt, items: AdminOrderItem[], total, status }`

#### 4.2.6 상태 관리/UX
- 초기 로드 시 `metrics`, `stock`, `orders?status=NEW` 병렬 요청.
- 주문 전환 성공 시 메트릭과 주문 리스트를 즉시 갱신(낙관적 업데이트 + 폴링 동기화).
- 버튼은 요청 중 로딩 인디케이터와 함께 비활성화.

#### 4.2.7 접근성(A11y)
- `+`, `-`, 상태 전환 버튼에 명확한 `aria-label` 제공.
- 키보드 조작 가능: Tab 순서 보장, Space/Enter로 클릭.
- 실시간 변경되는 카운트는 시각적으로만 변하지 않도록 라이브 리전(ARIA live) 사용 고려.

#### 4.2.8 반응형 가이드
- ≥ 1024px: 3열 재고 그리드, 우측 주문 큐가 세로로 충분히 보이도록.
- 600–1023px: 2열.
- < 600px: 1열, 메트릭→재고→주문 순으로 세로 스택.

#### 4.2.9 성능/품질
- 폴링은 3초(조정 가능). 중복 요청 방지(이전 요청 미완료 시 스킵).
- 재고 증감은 연타 시 배치 처리 옵션(최대 10회/1초, MVP에서는 즉시 전송).

#### 4.2.10 예외/제약
- 재고 0인 상품은 사용자측 `담기` 비활성화와 일관되도록 서버가 `isAvailable=false` 제공.
- 주문이 `DONE`이면 수정 불가.

#### 4.2.11 수용 기준(AC)
- AC1: 메트릭이 표시되고 3초 주기로 갱신된다.
- AC2: `+`/`-` 클릭 시 재고 수량이 0 미만으로 내려가지 않으며 서버 반영이 된다.
- AC3: 신규 주문은 리스트에 표시되고 `주문 접수` 클릭 시 상태가 `ACCEPTED`로 변경된다.
- AC4: `제조 시작`→`제조 완료` 버튼으로 상태가 순차적으로 변경된다.
- AC5: 재고 부족 시 `주문 접수`가 실패하고 사용자에게 이유가 안내된다.

---

## 5. 백엔드 사양

### 5.1 백엔드 개요

- **목표**: 커피 주문 앱의 메뉴, 옵션, 주문, 재고 데이터를 안정적으로 관리하고 REST API를 제공한다.
- **기술 스택**: Node.js, Express, PostgreSQL
- **데이터베이스**: PostgreSQL을 사용하여 데이터 영속성 확보

### 5.2 데이터 모델

#### 5.2.1 테이블 구조

##### Menus (메뉴)
커피 메뉴 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | VARCHAR(50) | PRIMARY KEY | 메뉴 고유 식별자 (예: 'americano-ice') |
| name | VARCHAR(100) | NOT NULL | 메뉴명 (예: '아메리카노(ICE)') |
| description | TEXT | | 메뉴 설명 |
| price | INTEGER | NOT NULL, CHECK (price >= 0) | 기본 가격 (원 단위) |
| image_url | VARCHAR(255) | | 메뉴 이미지 URL |
| stock | INTEGER | NOT NULL, DEFAULT 0, CHECK (stock >= 0) | 현재 재고 수량 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시각 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 수정 시각 |

##### Options (옵션)
메뉴에 추가 가능한 옵션 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | VARCHAR(50) | PRIMARY KEY | 옵션 고유 식별자 (예: 'extra-shot') |
| name | VARCHAR(100) | NOT NULL | 옵션명 (예: '샷 추가') |
| price_delta | INTEGER | NOT NULL, DEFAULT 0 | 추가 가격 (원 단위, 음수 가능) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시각 |

##### MenuOptions (메뉴-옵션 연결)
메뉴와 옵션의 다대다 관계를 관리하는 중간 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| menu_id | VARCHAR(50) | FOREIGN KEY (Menus.id) | 메뉴 ID |
| option_id | VARCHAR(50) | FOREIGN KEY (Options.id) | 옵션 ID |

- PRIMARY KEY: (menu_id, option_id)
- ON DELETE CASCADE: 메뉴 또는 옵션 삭제 시 연결도 자동 삭제

##### Orders (주문)
고객의 주문 정보를 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 주문 고유 번호 (자동 증가) |
| order_id | VARCHAR(50) | UNIQUE, NOT NULL | 주문 식별자 (예: '001', '002') |
| total | INTEGER | NOT NULL, CHECK (total >= 0) | 총 주문 금액 (원 단위) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'NEW' | 주문 상태 (NEW, ACCEPTED, IN_PROGRESS, DONE) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 주문 생성 시각 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 주문 수정 시각 |

##### OrderItems (주문 항목)
주문에 포함된 개별 메뉴 항목을 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 항목 고유 번호 |
| order_id | INTEGER | FOREIGN KEY (Orders.id) ON DELETE CASCADE | 주문 ID |
| product_id | VARCHAR(50) | NOT NULL | 메뉴 ID (Menus.id 참조) |
| product_name | VARCHAR(100) | NOT NULL | 메뉴명 (스냅샷) |
| quantity | INTEGER | NOT NULL, CHECK (quantity > 0) | 수량 |
| unit_price | INTEGER | NOT NULL | 단위 가격 (옵션 포함) |
| line_total | INTEGER | NOT NULL | 라인 총액 (unit_price × quantity) |

##### OrderItemOptions (주문 항목 옵션)
주문 항목에 선택된 옵션을 저장하는 테이블

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 고유 번호 |
| order_item_id | INTEGER | FOREIGN KEY (OrderItems.id) ON DELETE CASCADE | 주문 항목 ID |
| option_name | VARCHAR(100) | NOT NULL | 옵션명 (스냅샷) |

#### 5.2.2 데이터 관계도
```
Menus ──┬─< MenuOptions >─┬── Options
        │                  
        └── (참조) OrderItems
        
Orders ──< OrderItems ──< OrderItemOptions
```

### 5.3 사용자 흐름 (데이터 관점)

#### 흐름 1: 메뉴 목록 조회
1. 사용자가 "주문하기" 탭 진입
2. 프론트엔드 → `GET /api/menu` 요청
3. 백엔드: Menus 테이블과 관련 Options 조회
4. 프론트엔드: 메뉴 목록 화면에 표시
5. 관리자 화면: Menus의 stock 정보를 "재고 현황"에 표시

#### 흐름 2: 주문 생성
1. 사용자가 장바구니에서 "주문하기" 클릭
2. 프론트엔드 → `POST /api/orders` 요청 (메뉴, 수량, 옵션, 금액)
3. 백엔드: 트랜잭션 시작
   - Orders 테이블에 주문 생성
   - OrderItems 테이블에 주문 항목 생성
   - OrderItemOptions 테이블에 옵션 정보 저장
4. 백엔드: 트랜잭션 커밋
5. 프론트엔드: 주문 완료 메시지 표시

#### 흐름 3: 주문 상태 관리
1. 관리자가 "관리자" 탭 진입
2. 프론트엔드 → `GET /api/admin/orders` 요청
3. 백엔드: Orders와 OrderItems 조인하여 조회
4. 관리자 화면: "주문 현황"에 표시
5. 관리자가 "주문 접수" 클릭
6. 프론트엔드 → `POST /api/admin/orders/:orderId/accept` 요청
7. 백엔드: 
   - 재고 확인 (Menus.stock)
   - 재고 충분 → Orders.status = 'ACCEPTED', Menus.stock 차감
   - 재고 부족 → 에러 반환
8. 프론트엔드: 상태 업데이트 또는 에러 메시지 표시

#### 흐름 4: 재고 관리
1. 관리자가 재고 증감 버튼(+/-) 클릭
2. 프론트엔드 → `PATCH /api/admin/stock/:productId` 요청
3. 백엔드: Menus.stock 값 업데이트
4. 프론트엔드: 재고 수량 즉시 반영

### 5.4 API 설계

#### 5.4.1 메뉴 관련 API

##### GET /api/menu
메뉴 목록 조회 (옵션 포함)

**요청**
- Method: GET
- Path: `/api/menu`
- Query Parameters: 없음

**응답**
- Status: 200 OK
- Body:
```json
{
  "items": [
    {
      "id": "americano-ice",
      "name": "아메리카노(ICE)",
      "price": 4000,
      "description": "깊고 진한 에스프레소에 시원한 얼음을 더한 클래식 커피",
      "imageUrl": null,
      "stock": 15,
      "options": [
        {
          "id": "extra-shot",
          "name": "샷 추가",
          "priceDelta": 500
        },
        {
          "id": "syrup",
          "name": "시럽 추가",
          "priceDelta": 0
        }
      ]
    }
  ]
}
```

**에러 응답**
- 500: 서버 내부 오류

#### 5.4.2 주문 관련 API

##### POST /api/orders
새 주문 생성

**요청**
- Method: POST
- Path: `/api/orders`
- Body:
```json
{
  "items": [
    {
      "productId": "americano-ice",
      "selectedOptionIds": ["extra-shot"],
      "quantity": 1
    },
    {
      "productId": "caffe-latte",
      "selectedOptionIds": [],
      "quantity": 2
    }
  ],
  "total": 14500
}
```

**응답**
- Status: 201 Created
- Body:
```json
{
  "orderId": "001",
  "status": "NEW",
  "createdAt": "2025-10-21T10:30:00.000Z"
}
```

**에러 응답**
- 400: 잘못된 요청 데이터
- 500: 서버 내부 오류

**처리 로직**
1. 트랜잭션 시작
2. Orders 테이블에 주문 생성
3. 각 항목에 대해:
   - Menus 테이블에서 가격 정보 조회
   - Options 테이블에서 옵션 가격 조회
   - 단위 가격 계산 (기본 가격 + 옵션 가격)
   - OrderItems에 저장
   - OrderItemOptions에 옵션 저장
4. 트랜잭션 커밋

##### GET /api/orders/:orderId
특정 주문 조회

**요청**
- Method: GET
- Path: `/api/orders/:orderId`
- Parameters: orderId (주문 ID)

**응답**
- Status: 200 OK
- Body:
```json
{
  "orderId": "001",
  "createdAt": "2025-10-21T10:30:00.000Z",
  "items": [
    {
      "productId": "americano-ice",
      "name": "아메리카노(ICE)",
      "selectedOptions": ["샷 추가"],
      "quantity": 1,
      "lineTotal": 4500
    }
  ],
  "total": 14500,
  "status": "NEW"
}
```

**에러 응답**
- 404: 주문을 찾을 수 없음
- 500: 서버 내부 오류

#### 5.4.3 관리자 API

##### GET /api/admin/metrics
관리자 대시보드 메트릭 조회

**요청**
- Method: GET
- Path: `/api/admin/metrics`

**응답**
- Status: 200 OK
- Body:
```json
{
  "total": 10,
  "accepted": 3,
  "inProgress": 2,
  "done": 5
}
```

##### GET /api/admin/stock
재고 목록 조회

**요청**
- Method: GET
- Path: `/api/admin/stock`

**응답**
- Status: 200 OK
- Body:
```json
{
  "items": [
    {
      "productId": "americano-ice",
      "name": "아메리카노(ICE)",
      "stock": 15
    },
    {
      "productId": "americano-hot",
      "name": "아메리카노(HOT)",
      "stock": 15
    }
  ]
}
```

##### PATCH /api/admin/stock/:productId
재고 수량 수정

**요청**
- Method: PATCH
- Path: `/api/admin/stock/:productId`
- Body:
```json
{
  "delta": 1
}
```
또는
```json
{
  "delta": -1
}
```

**응답**
- Status: 200 OK
- Body:
```json
{
  "productId": "americano-ice",
  "stock": 16
}
```

**에러 응답**
- 400: delta가 누락되었거나 잘못된 값
- 404: 메뉴를 찾을 수 없음
- 409: 재고가 0 미만으로 떨어질 수 없음
- 500: 서버 내부 오류

**처리 로직**
1. Menus 테이블에서 현재 재고 조회
2. 새 재고 = 현재 재고 + delta
3. 새 재고 < 0이면 에러 반환
4. 새 재고 > 999이면 999로 제한
5. Menus.stock 업데이트

##### GET /api/admin/orders
주문 목록 조회

**요청**
- Method: GET
- Path: `/api/admin/orders`
- Query Parameters:
  - status (optional): NEW, ACCEPTED, IN_PROGRESS, DONE

**응답**
- Status: 200 OK
- Body:
```json
{
  "orders": [
    {
      "orderId": "001",
      "createdAt": "2025-10-21T10:30:00.000Z",
      "items": [
        {
          "productId": "americano-ice",
          "name": "아메리카노(ICE)",
          "selectedOptions": ["샷 추가"],
          "quantity": 1,
          "lineTotal": 4500
        }
      ],
      "total": 14500,
      "status": "NEW"
    }
  ]
}
```

##### POST /api/admin/orders/:orderId/accept
주문 접수 (NEW → ACCEPTED)

**요청**
- Method: POST
- Path: `/api/admin/orders/:orderId/accept`

**응답**
- Status: 200 OK
- Body:
```json
{
  "orderId": "001",
  "status": "ACCEPTED"
}
```

**에러 응답**
- 400: 이미 접수된 주문이거나 상태 전환 불가
- 404: 주문을 찾을 수 없음
- 409: 재고 부족
- 500: 서버 내부 오류

**처리 로직**
1. 트랜잭션 시작
2. 주문 상태 확인 (status = 'NEW')
3. 주문 항목별 재고 확인
4. 재고 부족 시 → 409 에러 반환 및 롤백
5. 재고 충분 시:
   - Orders.status = 'ACCEPTED'
   - Menus.stock 차감 (각 항목의 수량만큼)
6. 트랜잭션 커밋

##### POST /api/admin/orders/:orderId/start
제조 시작 (ACCEPTED → IN_PROGRESS)

**요청**
- Method: POST
- Path: `/api/admin/orders/:orderId/start`

**응답**
- Status: 200 OK
- Body:
```json
{
  "orderId": "001",
  "status": "IN_PROGRESS"
}
```

##### POST /api/admin/orders/:orderId/complete
제조 완료 (IN_PROGRESS → DONE)

**요청**
- Method: POST
- Path: `/api/admin/orders/:orderId/complete`

**응답**
- Status: 200 OK
- Body:
```json
{
  "orderId": "001",
  "status": "DONE"
}
```

### 5.5 데이터베이스 설정

#### 5.5.1 초기 데이터 (Seed Data)

##### Menus
```sql
INSERT INTO menus (id, name, description, price, stock) VALUES
('americano-ice', '아메리카노(ICE)', '깊고 진한 에스프레소에 시원한 얼음을 더한 클래식 커피', 4000, 15),
('americano-hot', '아메리카노(HOT)', '진한 에스프레소 샷에 뜨거운 물을 더한 따뜻한 커피', 4000, 15),
('caffe-latte', '카페라떼', '부드러운 스팀 우유와 에스프레소가 어우러진 인기 메뉴', 5000, 10),
('cappuccino', '카푸치노', '부드러운 우유 거품과 에스프레소의 완벽한 조화', 5000, 8),
('vanilla-latte', '바닐라 라떼', '달콤한 바닐라 시럽과 부드러운 우유가 어우러진 라떼', 5500, 3),
('caramel-macchiato', '캬라멜 마키아또', '달콤한 캬라멜 드리즐과 에스프레소의 환상적인 조합', 6000, 0);
```

##### Options
```sql
INSERT INTO options (id, name, price_delta) VALUES
('extra-shot', '샷 추가', 500),
('syrup', '시럽 추가', 0),
('cinnamon', '시나몬 추가', 0),
('whipped-cream', '휘핑크림 추가', 500),
('extra-caramel', '캬라멜 시럽 추가', 500);
```

##### MenuOptions
```sql
INSERT INTO menu_options (menu_id, option_id) VALUES
('americano-ice', 'extra-shot'),
('americano-ice', 'syrup'),
('americano-hot', 'extra-shot'),
('americano-hot', 'syrup'),
('caffe-latte', 'extra-shot'),
('caffe-latte', 'syrup'),
('cappuccino', 'extra-shot'),
('cappuccino', 'cinnamon'),
('vanilla-latte', 'extra-shot'),
('vanilla-latte', 'whipped-cream'),
('caramel-macchiato', 'extra-shot'),
('caramel-macchiato', 'extra-caramel');
```

### 5.6 기술 요구사항

#### 5.6.1 서버 환경
- Node.js: v18.x 이상
- Express: v4.x
- PostgreSQL: v14.x 이상

#### 5.6.2 필수 npm 패키지
- express: 웹 프레임워크
- pg: PostgreSQL 클라이언트
- dotenv: 환경 변수 관리
- cors: CORS 처리
- body-parser: 요청 본문 파싱

#### 5.6.3 프로젝트 구조
```
backend/
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
│   │   ├── Order.js
│   │   └── Stock.js
│   └── app.js                # Express 앱 설정
├── scripts/
│   └── init-db.sql           # DB 스키마 및 시드 데이터
├── .env                      # 환경 변수
├── package.json
└── server.js                 # 서버 진입점
```

### 5.7 보안 및 검증

#### 5.7.1 입력 검증
- 모든 API 요청 데이터 유효성 검사
- SQL Injection 방지 (파라미터화된 쿼리 사용)
- XSS 방지 (입력 값 이스케이프)

#### 5.7.2 에러 처리
- 모든 API는 일관된 에러 응답 형식 사용
```json
{
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": "재고 부족: 아메리카노(ICE)의 재고가 부족합니다"
  }
}
```

#### 5.7.3 트랜잭션 관리
- 주문 생성 시 트랜잭션 사용
- 주문 접수 + 재고 차감 시 트랜잭션 사용
- 실패 시 자동 롤백

### 5.8 성능 최적화

#### 5.8.1 데이터베이스 인덱스
```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### 5.8.2 쿼리 최적화
- JOIN 쿼리 최소화
- 필요한 컬럼만 SELECT
- N+1 문제 방지 (관련 데이터 한 번에 조회)

### 5.9 개발 가이드

#### 5.9.1 환경 변수 (.env)
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

#### 5.9.2 API 테스트
- 각 API 엔드포인트에 대한 단위 테스트
- 통합 테스트 (주문 생성 → 재고 차감 흐름)
- 에러 케이스 테스트

### 5.10 배포 고려사항

#### 5.10.1 프로덕션 설정
- 환경 변수로 DB 연결 정보 관리
- 로깅 시스템 구축 (winston 등)
- HTTPS 적용
- Rate Limiting 적용

#### 5.10.2 모니터링
- API 응답 시간 모니터링
- DB 연결 풀 상태 모니터링
- 에러 로그 수집 및 알림