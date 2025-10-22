-- 데이터베이스 검증 쿼리

-- 1. 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. 메뉴 데이터 확인
SELECT id, name, price, stock FROM menus ORDER BY id;

-- 3. 옵션 데이터 확인
SELECT id, name, price_delta FROM options ORDER BY id;

-- 4. 메뉴-옵션 연결 확인
SELECT m.name as menu_name, o.name as option_name
FROM menu_options mo
JOIN menus m ON mo.menu_id = m.id
JOIN options o ON mo.option_id = o.id
ORDER BY m.id, o.id;

