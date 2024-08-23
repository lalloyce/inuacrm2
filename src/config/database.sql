-- Create the database
CREATE DATABASE IF NOT EXISTS `Inua_crm`;
USE `Inua_crm`;

-- Drop tables if they exist
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS sales_contracts;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS customer_groups;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS PasswordResetTokens;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'group_coordinator', 'sales_manager', 'customer_service', 'management') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PasswordResetTokens Table
CREATE TABLE PasswordResetTokens (
    TokenID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Token VARCHAR(255) NOT NULL,
    ExpiresAt TIMESTAMP NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES users(id)
);

-- Customer Groups table
CREATE TABLE customer_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    coordinator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coordinator_id) REFERENCES users(id)
);

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    group_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES customer_groups(id)
);

-- Sales Contracts table
CREATE TABLE sales_contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    installment_amount DECIMAL(10, 2) NOT NULL,
    installment_frequency ENUM('weekly', 'bi-weekly', 'monthly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'completed', 'defaulted') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES sales_contracts(id)
);

-- Support Tickets table
CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Insert dummy data
INSERT INTO users (username, email, password, role) VALUES
('admin1', 'admin1@inua.com', '$2b$10$1234567890123456789012', 'admin'),
('gc1', 'gc1@inua.com', '$2b$10$1234567890123456789012', 'group_coordinator'),
('sm1', 'sm1@inua.com', '$2b$10$1234567890123456789012', 'sales_manager'),
('cs1', 'cs1@inua.com', '$2b$10$1234567890123456789012', 'customer_service'),
('mgmt1', 'mgmt1@inua.com', '$2b$10$1234567890123456789012', 'management');

INSERT INTO customer_groups (name, coordinator_id) VALUES
('Group A', 2),
('Group B', 2);

INSERT INTO customers (name, email, phone, address, group_id) VALUES
('John Doe', 'john@example.com', '1234567890', '123 Main St, City', 1),
('Jane Smith', 'jane@example.com', '0987654321', '456 Elm St, Town', 1),
('Bob Johnson', 'bob@example.com', '1122334455', '789 Oak St, Village', 2);

INSERT INTO sales_contracts (customer_id, product_name, total_amount, installment_amount, installment_frequency, start_date, end_date, status) VALUES
(1, 'Solar Panel', 1000.00, 100.00, 'monthly', '2023-01-01', '2023-10-01', 'active'),
(2, 'Water Pump', 500.00, 50.00, 'bi-weekly', '2023-02-01', '2023-07-01', 'active'),
(3, 'Tractor', 5000.00, 500.00, 'monthly', '2023-03-01', '2024-02-01', 'active');

INSERT INTO payments (contract_id, amount, payment_date) VALUES
(1, 100.00, '2023-02-01'),
(1, 100.00, '2023-03-01'),
(2, 50.00, '2023-02-15'),
(2, 50.00, '2023-03-01'),
(3, 500.00, '2023-04-01');

INSERT INTO support_tickets (customer_id, subject, description, status, assigned_to) VALUES
(1, 'Solar Panel Issues', 'My solar panel is not working properly', 'open', 4),
(2, 'Payment Question', 'I have a question about my last payment', 'in_progress', 4),
(3, 'Tractor Maintenance', 'Need help with tractor maintenance', 'resolved', 4);