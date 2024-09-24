-- This script is used to create the database schema for Inua CRM
-- It includes the creation of various tables, their columns, data types, and constraints

-- Create the database if it doesn't exist and switch to it
CREATE DATABASE IF NOT EXISTS inuacrm;
USE inuacrm;

-- Create the users table
-- This table stores information about the users of the system
-- It includes their email, password, full name, role, verification status, avatar, and login details
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

-- Create the group_leaders table
-- This table stores information about the group leaders
-- It includes their name, mobile number, location, and creation/update details
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the groups table
-- This table stores information about the groups
-- It includes the group name, leader, and creation/update details
CREATE TABLE IF NOT EXISTS groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    group_leader_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_leader_id) REFERENCES group_leaders(id)
);

-- Add foreign key to group_leaders table
-- This adds a foreign key to the group_leaders table, linking it to the groups table
ALTER TABLE group_leaders
ADD COLUMN group_id INT,
ADD FOREIGN KEY (group_id) REFERENCES groups(id);

-- Create the group_sales_contracts table
-- This table stores information about the group sales contracts
-- It includes the group, contract details, and creation/update details
CREATE TABLE IF NOT EXISTS group_sales_contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    contract_date DATE NOT NULL,
    final_due_date DATE NOT NULL,
    sales_territory VARCHAR(100) NOT NULL,
    total_items_sold INT NOT NULL,
    total_group_down_payment DECIMAL(10,2) NOT NULL,
    total_group_monthly_installment DECIMAL(10,2) NOT NULL,
    total_group_payment_plan_price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'completed', 'defaulted') NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- Create the customers table
-- This table stores information about the customers
-- It includes their personal details, location, group sales contract, and creation/update details
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    national_id_number VARCHAR(20) NOT NULL UNIQUE,
    mpesa_mobile_number VARCHAR(15) NOT NULL UNIQUE,
    alternative_mobile_number VARCHAR(15),
    gender ENUM('male', 'female', 'other') NOT NULL,
    date_of_birth DATE NOT NULL,
    village VARCHAR(100),
    sub_location VARCHAR(100),
    ward VARCHAR(100),
    sub_county VARCHAR(100),
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang''a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    group_sales_contract_id INT,
    is_group_leader TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (group_sales_contract_id) REFERENCES group_sales_contracts(id)
);

-- Create the products table
-- This table stores information about the products
-- It includes the product name, SKU, prices, estimated profit, and creation/update details
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    buying_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    estimated_profit DECIMAL(10,2) GENERATED ALWAYS AS (selling_price - buying_price) STORED,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (product_sku),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create the sales_targets table
-- This table stores information about the sales targets
-- It includes the product, group coordinator, monthly target, estimated revenue, and creation/update details
CREATE TABLE IF NOT EXISTS sales_targets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    group_coordinator_id INT NOT NULL,
    monthly_target INT NOT NULL COMMENT 'units per month',
    estimated_revenue_downpayment DECIMAL(10,2) NOT NULL,
    estimated_revenue_repayments DECIMAL(10,2) NOT NULL,
    total_items_sold INT DEFAULT 0,
    remaining_products_to_sell INT GENERATED ALWAYS AS (monthly_target - total_items_sold) STORED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (group_coordinator_id) REFERENCES users(id)
);

-- Create the product_sales table
-- This table stores information about the product sales
-- It includes the contract, product, quantity sold, sale date, total amount, and creation/update details
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

-- Create the customer_balances table
-- This table stores information about the customer balances
-- It includes the customer, contract, loan details, repayment details, and creation/update details
CREATE TABLE IF NOT EXISTS customer_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    contract_id INT NOT NULL,
    loan_term INT NOT NULL COMMENT 'in months',
    loan_principle DECIMAL(10, 2) NOT NULL,
    downpayment DECIMAL(10,2) NOT NULL,
    weekly_repayment_amount DECIMAL(10,2) GENERATED ALWAYS AS ((selling_price - downpayment) / loan_term) STORED,
    amount_paid DECIMAL(10, 2) NOT NULL,
    loan_outstanding_balance DECIMAL(10, 2) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    UNIQUE KEY (customer_id, contract_id)
);

-- Create the payments table
-- This table stores information about the payments
-- It includes the contract, customer, payment details, and creation details
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_date DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('down_payment', 'installment') NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create the deals table
-- This table stores information about the deals
-- It includes the customer, assigned user, deal amount, status, expected close date, and creation/update details
CREATE TABLE IF NOT EXISTS deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    assigned_to INT,
    amount DECIMAL(10,2),
    status ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    expected_close_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Create the group_events table
-- This table stores information about the group events
-- It includes the event type, title, description, date, time, location, status, and creation/update details
CREATE TABLE IF NOT EXISTS group_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type ENUM('arrears_meeting', 'formation_meeting', 'training_meeting') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    sub_location VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang''a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create the group_event_attendees table
-- This table stores information about the group event attendees
-- It includes the event, customer, attendance status, and creation details
CREATE TABLE IF NOT EXISTS group_event_attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    customer_id INT NOT NULL,
    attended TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES group_events(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create the group_event_groups table
-- This table stores information about the group event groups
-- It includes the event, group, and creation details
CREATE TABLE IF NOT EXISTS group_event_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES group_events(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

-- Create the password_reset_tokens table
-- This table stores information about the password reset tokens
-- It includes the user, token, expiration date, and creation details
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the sessions table
-- This table stores information about the user sessions
-- It includes the session ID, user, expiration date, session data, and creation details
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires DATETIME NOT NULL,
    data TEXT COLLATE utf8mb4_bin,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the tickets table
-- This table stores information about the tickets
-- It includes the customer, assigned user, status, priority, subject, description, and creation/update details
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    assigned_to INT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Create the notifications table
-- This table stores information about the notifications
-- It includes the message, user, and creation/update details
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create the AuditLogs table
-- This table stores information about the audit logs
-- It includes the user, action, endpoint, method, status code, message, and creation/update details
CREATE TABLE IF NOT EXISTS AuditLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    action VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    statusCode INT NOT NULL,
    message VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create indexes for user management
-- These indexes improve the performance of user management operations
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_session_user_id ON sessions(user_id);
CREATE INDEX idx_group_leader_id ON group_leaders(mobile_number);
CREATE INDEX idx_customer_id ON customers(national_id_number);
CREATE INDEX idx_mpesa ON customers(mpesa_mobile_number);
CREATE INDEX idx_group_sales_contract_id ON customers(group_sales_contract_id);
CREATE INDEX idx_created_by ON customers(created_by);
CREATE INDEX idx_group_id ON group_sales_contracts(group_id);
CREATE INDEX idx_event_id ON group_event_attendees(event_id);
CREATE INDEX idx_group_event_id ON group_event_groups(event_id);