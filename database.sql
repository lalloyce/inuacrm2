CREATE DATABASE inua_crm;
USE inua_crm;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    avatar VARCHAR(255),
    last_login DATETIME,
    login_count INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires DATETIME NOT NULL,
    data TEXT COLLATE utf8mb4_bin,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE group_leaders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    village VARCHAR(100),
    sub_location VARCHAR(100),
    ward VARCHAR(100),
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_leader_id INT NOT NULL,
    group_coordinator_id INT NOT NULL,
    member_count INT NOT NULL CHECK (member_count BETWEEN 5 AND 10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_leader_id) REFERENCES group_leaders(id),
    FOREIGN KEY (group_coordinator_id) REFERENCES users(id)
);

CREATE TABLE group_sales_contracts (
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
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE customers (
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
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    group_sales_contract_id INT,
    is_group_leader BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_sales_contract_id) REFERENCES group_sales_contracts(id)
);

CREATE TABLE tickets (
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

CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    assigned_to INT,
    amount DECIMAL(10, 2),
    status ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    expected_close_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE group_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type ENUM('arrears_meeting', 'formation_meeting', 'training_meeting') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    sub_location VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    county ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City') NOT NULL,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE group_event_attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    customer_id INT NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES group_events(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE group_event_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES group_events(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_date DATETIME NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_type ENUM('down_payment', 'installment') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE customer_balances (
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

CREATE TABLE contract_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_serial_number VARCHAR(50) UNIQUE NOT NULL,
    down_payment DECIMAL(10, 2) NOT NULL,
    monthly_installment DECIMAL(10, 2) NOT NULL,
    total_payment_plan_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES group_sales_contracts(id)
);
