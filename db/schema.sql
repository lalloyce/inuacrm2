CREATE DATABASE IF NOT EXISTS inuacrm;
USE inuacrm;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    avatar VARCHAR(255),
    last_login DATETIME,
    login_count INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires DATETIME NOT NULL,
    data TEXT COLLATE utf8mb4_bin,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create group_leaders table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_leaders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    village VARCHAR(100),
    sub_location VARCHAR(100),
    ward VARCHAR(100),
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang''a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Create groups table if it doesn't exist
CREATE TABLE IF NOT EXISTS `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_leader_id INT NOT NULL,
    group_coordinator_id INT NOT NULL,
    member_count INT NOT NULL CHECK (member_count BETWEEN 5 AND 10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (group_leader_id) REFERENCES group_leaders(id),
    FOREIGN KEY (group_coordinator_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Check if the index exists and create it if it doesn't
SET @exist := (SELECT COUNT(1) 
               FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'groups' 
               AND INDEX_NAME = 'idx_group_leader_id');

SET @sqlstmt := IF(@exist > 0, 'SELECT ''Index already exists.''', 
                    'CREATE INDEX idx_group_leader_id ON `groups`(group_leader_id)');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Repeat for other indexes
SET @exist := (SELECT COUNT(1) 
               FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'groups' 
               AND INDEX_NAME = 'idx_group_coordinator_id');

SET @sqlstmt := IF(@exist > 0, 'SELECT ''Index already exists.''', 
                    'CREATE INDEX idx_group_coordinator_id ON `groups`(group_coordinator_id)');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create group_sales_contracts table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_sales_contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    contract_date DATE NOT NULL,
    final_due_date DATE NOT NULL,
    sales_territory VARCHAR(100) NOT NULL,
    total_items_sold INT NOT NULL,
    total_group_down_payment DECIMAL(10, 2) NOT NULL,
    total_group_monthly_installment DECIMAL(10, 2) NOT NULL,
    total_group_payment_plan_price DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'completed', 'defaulted') NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id)
);

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    national_id_number VARCHAR(20) UNIQUE NOT NULL,
    mpesa_mobile_number VARCHAR(15) UNIQUE NOT NULL,
    alternative_mobile_number VARCHAR(15),
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    village VARCHAR(100),
    sub_location VARCHAR(100),
    ward VARCHAR(100),
    sub_county VARCHAR(100),
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang''a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    group_sales_contract_id INT,
    is_group_leader BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (group_sales_contract_id) REFERENCES group_sales_contracts(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create customer_balances table if it doesn't exist
CREATE TABLE IF NOT EXISTS customer_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    contract_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    remaining_balance DECIMAL(10, 2) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    UNIQUE KEY (customer_id, contract_id)
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    buying_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    estimated_profit DECIMAL(10,2) GENERATED ALWAYS AS (selling_price - buying_price) STORED,
    loan_term INT NOT NULL COMMENT 'in months',
    downpayment DECIMAL(10,2) NOT NULL,
    monthly_repayment_amount DECIMAL(10,2) GENERATED ALWAYS AS ((selling_price - downpayment) / loan_term) STORED,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (product_sku),
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create sales_targets table if it doesn't exist
CREATE TABLE IF NOT EXISTS sales_targets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    group_coordinator_id INT NOT NULL,
    monthly_target INT NOT NULL COMMENT 'units per month',
    estimated_revenue_downpayment DECIMAL(10,2) NOT NULL,
    estimated_revenue_repayments DECIMAL(10,2) NOT NULL,
    remaining_products_to_sell INT GENERATED ALWAYS AS (total_items_sold - monthly_target) STORED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (group_coordinator_id) REFERENCES users(id)
);

-- Create product_sales table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_sold INT NOT NULL,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create AuditLogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS AuditLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    action VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    statusCode INT NOT NULL,
    message VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    assigned_to INT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Create indexes for user management
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_session_user_id ON sessions(user_id);
CREATE INDEX idx_group_leader_id ON group_leaders(mobile_number);
