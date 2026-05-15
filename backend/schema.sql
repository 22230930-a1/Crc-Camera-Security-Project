-- ==============================
-- CRC CAMERA SECURITY DATABASE
-- PostgreSQL Schema
-- ==============================

-- Drop tables in correct order if you want to reset database
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS installations CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- ==============================
-- ADMINS
-- ==============================

CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(50) DEFAULT 'admin',
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- CUSTOMERS
-- ==============================

CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- CATEGORIES
-- ==============================

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- ==============================
-- PRODUCTS
-- ==============================

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  type VARCHAR(100),
  resolution VARCHAR(100),
  warranty VARCHAR(100),
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  image_url TEXT,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- CARTS
-- One customer can have one active cart
-- ==============================

CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- CART ITEMS
-- A cart can contain many products
-- ==============================

CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT REFERENCES carts(cart_id) ON DELETE CASCADE,
  product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- ==============================
-- ORDERS
-- A customer can place many orders
-- ==============================

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id) ON DELETE SET NULL,
  customer_name VARCHAR(100),
  customer_phone VARCHAR(30),
  customer_email VARCHAR(150),
  shipping_address TEXT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'pending',
  order_status VARCHAR(50) DEFAULT 'new',
  payment_method VARCHAR(50) DEFAULT 'whish'
);

-- ==============================
-- ORDER ITEMS
-- One order contains many products
-- ==============================

CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INT REFERENCES products(product_id) ON DELETE SET NULL,
  product_name VARCHAR(150),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- ==============================
-- SERVICE REQUESTS / QUOTE REQUESTS
-- Customer asks for installation or quotation
-- ==============================

CREATE TABLE service_requests (
  request_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id) ON DELETE SET NULL,
  order_id INT REFERENCES orders(order_id) ON DELETE SET NULL,
  full_name VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(150),
  location TEXT,
  service_type VARCHAR(100),
  property_type VARCHAR(100),
  camera_count INT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- INSTALLATIONS
-- A service request can result in installation
-- ==============================

CREATE TABLE installations (
  installation_id SERIAL PRIMARY KEY,
  request_id INT REFERENCES service_requests(request_id) ON DELETE SET NULL,
  admin_id INT REFERENCES admins(admin_id) ON DELETE SET NULL,
  install_date DATE,
  technician_name VARCHAR(100),
  installation_status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- PAYMENTS
-- One order can have payment information
-- ==============================

CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) DEFAULT 'whish',
  transaction_ref VARCHAR(150),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- REVIEWS
-- Customer writes review for product
-- ==============================

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
  product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- SAMPLE DATA
-- ==============================

INSERT INTO categories (category_name, description)
VALUES
('Cameras', 'Indoor and outdoor CCTV security cameras'),
('NVRs', 'Network video recorders for IP camera systems'),
('Accessories', 'PoE switches, brackets, power supplies, and cables');

INSERT INTO products 
(category_id, name, brand, model, type, resolution, warranty, description, price, stock_quantity, image_url, status)
VALUES
(1, 'CRC Outdoor Camera – 8MP POE IP Camera', 'CRC', 'CRC-CAM-8MP', 'Outdoor', '8MP', '1 Year', 'Outdoor full color POE IP camera with night vision up to 30m.', 55.00, 20, '/images/cam1.jpg', 'active'),

(1, 'CRC Indoor Camera – 5MP POE IP Camera', 'CRC', 'CRC-CAM-5MP', 'Indoor', '5MP', '1 Year', 'Indoor POE IP camera suitable for homes, offices, and shops.', 35.00, 25, '/images/cam2.jpg', 'active'),

(2, 'CRC 4 Channel POE NVR', 'CRC', 'CRC-NVR-4CH', '4 Channel', '4K Support', '1 Year', '4 channel NVR for small CCTV systems.', 70.00, 10, '/images/nvr4.jpg', 'active'),

(2, 'CRC 8 Channel POE NVR', 'CRC', 'CRC-NVR-8CH', '8 Channel', '4K Support', '1 Year', '8 channel NVR for medium CCTV systems.', 110.00, 8, '/images/nvr8.jpg', 'active'),

(3, 'CRC 4 Port PoE Switch', 'CRC', 'CRC-POE-4', 'PoE Switch', NULL, '1 Year', 'PoE switch for IP camera installation.', 35.00, 15, '/images/poe-switch.jpg', 'active'),

(3, 'CRC CCTV Wall Bracket', 'CRC', 'CRC-BRACKET', 'Bracket', NULL, '6 Months', 'Wall bracket for CCTV camera mounting.', 8.00, 50, '/images/bracket.jpg', 'active');