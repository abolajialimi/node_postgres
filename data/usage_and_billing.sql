
-- Inserting 48 records for 4 customers over 12 months
-- Inserting data into usage_and_billing table for Linda Green, Abolaji Alimi, and Jane Doe
INSERT INTO usage_and_billing (account_id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status)
VALUES 
-- Linda Green (Account ID 1, assuming account_id 1 for Linda Green)
(1001, '2025-01-01', 120.50, 30.25, 150.75, 'Unpaid'),
(1001, '2025-02-01', 130.75, 35.10, 165.85, 'Unpaid'),
(1001, '2025-03-01', 115.40, 32.50, 150.50, 'Unpaid'),
(1001, '2025-04-01', 140.00, 40.00, 180.00, 'Unpaid'),
(1001, '2025-05-01', 125.60, 33.20, 158.80, 'Unpaid'),
(1001, '2025-06-01', 135.20, 37.60, 172.80, 'Unpaid'),

-- Abolaji Alimi (Account ID 2, assuming account_id 2 for Abolaji Alimi)
(1002, '2025-01-01', 100.10, 50.00, 150.10, 'Unpaid'),
(1002, '2025-02-01', 105.50, 52.25, 157.75, 'Unpaid'),
(1002, '2025-03-01', 95.75, 48.50, 144.25, 'Unpaid'),
(1002, '2025-04-01', 110.80, 55.00, 165.80, 'Unpaid'),
(1002, '2025-05-01', 105.20, 50.60, 155.80, 'Unpaid'),
(1002, '2025-06-01', 115.00, 53.50, 168.50, 'Unpaid'),

-- Jane Doe (Account ID 3, assuming account_id 3 for Jane Doe)
(1003, '2025-01-01', 140.00, 0.00, 140.00, 'Unpaid'),
(1003, '2025-02-01', 145.30, 0.00, 145.30, 'Unpaid'),
(1003, '2025-03-01', 138.20, 0.00, 138.20, 'Unpaid'),
(1003, '2025-04-01', 150.00, 0.00, 150.00, 'Unpaid'),
(1003, '2025-05-01', 143.10, 0.00, 143.10, 'Unpaid'),
(1003, '2025-06-01', 155.40, 0.00, 155.40, 'Unpaid');
