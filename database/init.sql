CREATE DATABASE IF NOT EXISTS digital_commerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE digital_commerce;

-- Este arquivo e uma referencia para MySQL Workbench.
-- Para manter o projeto evolutivo, prefira gerar migrations com:
-- npx prisma migrate dev

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  passwordHash VARCHAR(191),
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  emailVerifiedAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX users_role_idx (role)
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description VARCHAR(255),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  shortDescription VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priceCents INT NOT NULL,
  imageUrl VARCHAR(500) NOT NULL,
  fileKey VARCHAR(500) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  categoryId VARCHAR(191) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT products_category_fk FOREIGN KEY (categoryId) REFERENCES categories(id),
  INDEX products_category_idx (categoryId),
  INDEX products_status_idx (status)
);

CREATE TABLE IF NOT EXISTS carts (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191),
  visitorToken VARCHAR(191) UNIQUE,
  expiresAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT carts_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX carts_user_idx (userId)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id VARCHAR(191) PRIMARY KEY,
  cartId VARCHAR(191) NOT NULL,
  productId VARCHAR(191) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cart_items_cart_fk FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT cart_items_product_fk FOREIGN KEY (productId) REFERENCES products(id),
  UNIQUE KEY cart_items_unique (cartId, productId),
  INDEX cart_items_product_idx (productId)
);

CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(191) PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  description VARCHAR(255),
  percentOff INT,
  amountOffCents INT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  maxRedemptions INT,
  redeemedCount INT NOT NULL DEFAULT 0,
  expiresAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX coupons_active_idx (active)
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(191) PRIMARY KEY,
  publicId VARCHAR(40) NOT NULL UNIQUE,
  userId VARCHAR(191),
  customerName VARCHAR(120) NOT NULL,
  customerEmail VARCHAR(191) NOT NULL,
  status ENUM('PENDING', 'PAID', 'CANCELED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  subtotalCents INT NOT NULL,
  discountCents INT NOT NULL DEFAULT 0,
  totalCents INT NOT NULL,
  couponId VARCHAR(191),
  accessTokenHash VARCHAR(191),
  accessTokenExpiresAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT orders_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT orders_coupon_fk FOREIGN KEY (couponId) REFERENCES coupons(id) ON DELETE SET NULL,
  INDEX orders_user_idx (userId),
  INDEX orders_email_idx (customerEmail),
  INDEX orders_status_idx (status)
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(191) PRIMARY KEY,
  orderId VARCHAR(191) NOT NULL,
  productId VARCHAR(191) NOT NULL,
  productName VARCHAR(180) NOT NULL,
  productSlug VARCHAR(220) NOT NULL,
  productFileKey VARCHAR(500) NOT NULL,
  unitPriceCents INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT order_items_order_fk FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_fk FOREIGN KEY (productId) REFERENCES products(id),
  INDEX order_items_order_idx (orderId),
  INDEX order_items_product_idx (productId)
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(191) PRIMARY KEY,
  orderId VARCHAR(191) NOT NULL,
  provider VARCHAR(40) NOT NULL,
  providerRef VARCHAR(191) UNIQUE,
  status ENUM('PENDING', 'APPROVED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  amountCents INT NOT NULL,
  paidAt DATETIME,
  safeLog JSON,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT payments_order_fk FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX payments_order_idx (orderId),
  INDEX payments_status_idx (status)
);

CREATE TABLE IF NOT EXISTS digital_downloads (
  id VARCHAR(191) PRIMARY KEY,
  orderItemId VARCHAR(191) NOT NULL,
  tokenHash VARCHAR(191) NOT NULL UNIQUE,
  expiresAt DATETIME NOT NULL,
  downloads INT NOT NULL DEFAULT 0,
  maxDownloads INT NOT NULL DEFAULT 5,
  lastDownloadedAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT digital_downloads_item_fk FOREIGN KEY (orderItemId) REFERENCES order_items(id) ON DELETE CASCADE,
  INDEX digital_downloads_item_idx (orderItemId),
  INDEX digital_downloads_expiry_idx (expiresAt)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191) NOT NULL,
  tokenHash VARCHAR(191) NOT NULL UNIQUE,
  expiresAt DATETIME NOT NULL,
  usedAt DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_resets_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX password_resets_user_idx (userId),
  INDEX password_resets_expiry_idx (expiresAt)
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id VARCHAR(191) PRIMARY KEY,
  userId VARCHAR(191),
  action VARCHAR(120) NOT NULL,
  metadata JSON,
  ip VARCHAR(80),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_logs_user_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX admin_logs_user_idx (userId),
  INDEX admin_logs_action_idx (action)
);
