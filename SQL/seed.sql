--psql -U postgres -d utility -h localhost -p 5432 -f seed.sql
--\i seed.sql
-- Drop existing tables if needed (use with caution)
DROP TABLE IF EXISTS usage_and_billing, customer_account, users;

-- Create users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    account_id INT UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) NOT NULL
);

-- Create customer_account
CREATE TABLE customer_account (
    id SERIAL PRIMARY KEY,
    account_id INT UNIQUE NOT NULL REFERENCES users(account_id),
    customer_name VARCHAR(100) NOT NULL,
    service_address TEXT NOT NULL,
    service_type VARCHAR(50),
    meter_id VARCHAR(50) NOT NULL
);

-- Create usage_and_billing
CREATE TABLE usage_and_billing (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES customer_account(account_id),
    billing_month VARCHAR(20),
    electricity_consumption DECIMAL,
    gas_consumption DECIMAL,
    total_amount DECIMAL,
    invoice_status VARCHAR(10) CHECK (invoice_status IN ('Paid', 'Pending'))
);

-- Insert sample users
INSERT INTO users (account_id, username, email,password, role) VALUES
(1001, 'admin', 'alimiabolaji@gmail.com','password', 'admin'),
(1002, 'aalimi', 'alimiabolaji2@gmail.com','aalimi#2025', 'user'),
(1003, 'lgreen', 'lgreen@example.com','lgreen#2025', 'user');




-- Insert corresponding customer accounts
INSERT INTO customer_account (account_id, customer_name, service_address, service_type, meter_id) VALUES
(1002, 'Abolaji Alimi', '123 Elm Street', 'Dual', 'MTR1002'),
(1003, 'Linda Green', '456 Oak Avenue', 'Dual', 'MTR1003');

-- Insert usage and billing data
INSERT INTO usage_and_billing (account_id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status) VALUES
(1002, '2025-01', 320, 50, 120.00, 'Paid'),
(1002, '2025-02', 280, 40, 110.00, 'Pending'),
(1003, '2025-01', 150, 0, 75.00, 'Pending'),
(1003, '2025-02', 170, 0, 85.00, 'Paid');
