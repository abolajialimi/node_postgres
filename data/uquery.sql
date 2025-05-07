-- to reset the whole database without deleting database
-- DROP TABLE IF EXISTS

-- 	admins,users,
	
-- 	customer_account,

-- 	usage_and_billing,

-- CASCADE;




SELECT * FROM users;
-- DELETE FROM usage_and_billing WHERE entry_id = '92b947a2-0861-4190-8e0b-f1137a2ae626' RETURNING *

-- SELECT * FROM usage_and_billing
-- ORDER BY account_id

-- Users Table
CREATE TABLE users (
    account_id INT PRIMARY KEY REFERENCES customer_account(account_id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
     role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (
        role = 'user'
	)
    
);
-- Alter the `account_id` column to allow NULL values for the admin user
CREATE TABLE admins (
    account_id INT PRIMARY KEY,      -- Use a separate primary key for admin
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (
        role = 'admin'
    )
);



-- Usage and Billing Table
CREATE TABLE usage_and_billing (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id INT NOT NULL REFERENCES customer_account(account_id) ON DELETE CASCADE,
    billing_month DATE NOT NULL,  -- Use 1st of month for YYYY-MM
    electricity_consumption NUMERIC(10,2) DEFAULT 0.0,
    gas_consumption NUMERIC(10,2) DEFAULT 0.0,
    total_amount NUMERIC(10,2) NOT NULL,
    invoice_status VARCHAR(20) NOT NULL CHECK (
        invoice_status IN ('Paid', 'Unpaid', 'Overdue')
    ),
    UNIQUE (account_id, billing_month)
);

-- Customer Account Table
CREATE TABLE customer_account (
    account_id SERIAL PRIMARY KEY,  -- Auto-incrementing account_id
    customer_name VARCHAR(100) NOT NULL,
    service_address TEXT NOT NULL,
    service_type VARCHAR(10) NOT NULL CHECK (service_type IN ('Gas', 'Electric', 'Dual')),
    meter_id VARCHAR(50) UNIQUE NOT NULL
);
SELECT * FROM customer_account;
SELECT * FROM usage_and_billing;




SELECT 
    u.account_id,
    u.username,
    u.email,
    u.role,
    c.customer_name,
    c.service_address,
    c.service_type,
    c.meter_id,
    ub.billing_month,
    ub.electricity_consumption,
    ub.gas_consumption,
    ub.total_amount,
    ub.invoice_status
FROM users u
JOIN customer_account c ON u.account_id = c.account_id
JOIN usage_and_billing ub ON c.account_id = ub.account_id
ORDER BY u.account_id, ub.billing_month;

