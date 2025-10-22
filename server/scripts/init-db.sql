-- Coffee Order App Database Schema and Seed Data

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS order_item_options CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_options CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- Create Menus table
CREATE TABLE menus (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Options table
CREATE TABLE options (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_delta INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MenuOptions table (Many-to-Many relationship)
CREATE TABLE menu_options (
    menu_id VARCHAR(50) REFERENCES menus(id) ON DELETE CASCADE,
    option_id VARCHAR(50) REFERENCES options(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, option_id)
);

-- Create Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    total INTEGER NOT NULL CHECK (total >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderItems table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL,
    line_total INTEGER NOT NULL
);

-- Create OrderItemOptions table
CREATE TABLE order_item_options (
    id SERIAL PRIMARY KEY,
    order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
    option_name VARCHAR(100) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Insert seed data for Menus
INSERT INTO menus (id, name, description, price, stock) VALUES
('americano-ice', '아메리카노(ICE)', '깊고 진한 에스프레소에 시원한 얼음을 더한 클래식 커피', 4000, 15),
('americano-hot', '아메리카노(HOT)', '진한 에스프레소 샷에 뜨거운 물을 더한 따뜻한 커피', 4000, 15),
('caffe-latte', '카페라떼', '부드러운 스팀 우유와 에스프레소가 어우러진 인기 메뉴', 5000, 10),
('cappuccino', '카푸치노', '부드러운 우유 거품과 에스프레소의 완벽한 조화', 5000, 8),
('vanilla-latte', '바닐라 라떼', '달콤한 바닐라 시럽과 부드러운 우유가 어우러진 라떼', 5500, 3),
('caramel-macchiato', '캬라멜 마키아또', '달콤한 캬라멜 드리즐과 에스프레소의 환상적인 조합', 6000, 0);

-- Insert seed data for Options
INSERT INTO options (id, name, price_delta) VALUES
('extra-shot', '샷 추가', 500),
('syrup', '시럽 추가', 0),
('cinnamon', '시나몬 추가', 0),
('whipped-cream', '휘핑크림 추가', 500),
('extra-caramel', '캬라멜 시럽 추가', 500);

-- Insert seed data for MenuOptions (Menu-Option relationships)
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

-- Verify data
SELECT 'Menus table' as table_name, COUNT(*) as row_count FROM menus
UNION ALL
SELECT 'Options table', COUNT(*) FROM options
UNION ALL
SELECT 'MenuOptions table', COUNT(*) FROM menu_options;

-- Display sample data
SELECT 
    m.id,
    m.name,
    m.price,
    m.stock,
    COUNT(mo.option_id) as option_count
FROM menus m
LEFT JOIN menu_options mo ON m.id = mo.menu_id
GROUP BY m.id, m.name, m.price, m.stock
ORDER BY m.id;

COMMIT;

