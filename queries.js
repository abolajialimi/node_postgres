
const pool = require('./db');


// Query to get Total Energy Consumption and Average Monthly Energy Consumption
const getEnergyConsumption = async (username) => {
    const query = `
  SELECT 
      ca.account_id,
      ca.customer_name,
      SUM(ub.gas_consumption + ub.electricity_consumption) AS total_energy_consumption,
      ROUND(AVG(ub.gas_consumption + ub.electricity_consumption), 2) AS avg_monthly_energy_consumption
  FROM 
      customer_account ca
  JOIN 
      usage_and_billing ub ON ca.account_id = ub.account_id
  JOIN 
      users u ON ca.account_id = u.account_id
  WHERE 
      ($1 = 'admin' OR u.username = $1)
  GROUP BY 
      ca.account_id, ca.customer_name;
`;

    
    try {
        const result = await pool.query(query, [username]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching energy consumption:', error);
        throw error;
    }
};
// Query to get Comparison to Previous Period – % increase or decrease
const getEnergyComparison = async (username) => {
    const query = `
    WITH energy_data AS (
        SELECT 
            ca.account_id,
            ca.customer_name,
            DATE_TRUNC('month', ub.period_start) AS month_start,
            SUM(ub.gas_consumption + ub.electricity_consumption) AS total_consumption
        FROM 
            customer_account ca
        JOIN 
            usage_and_billing ub ON ca.account_id = ub.account_id
        JOIN 
            users u ON u.account_id = ca.account_id
        WHERE 
            ($1 = 'admin' OR u.username = $1)
        GROUP BY 
            ca.account_id, ca.customer_name, DATE_TRUNC('month', ub.period_start)
    ),
    ranked_data AS (
        SELECT 
            ed.*,
            ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY month_start DESC) AS rn
        FROM 
            energy_data ed
    ),
    pivoted AS (
        SELECT 
            curr.account_id,
            curr.customer_name,
            curr.month_start AS current_month,
            curr.total_consumption AS current_consumption,
            prev.month_start AS previous_month,
            prev.total_consumption AS previous_consumption
        FROM 
            ranked_data curr
        LEFT JOIN 
            ranked_data prev 
            ON curr.account_id = prev.account_id AND curr.rn = 1 AND prev.rn = 2
        WHERE curr.rn = 1
    )
    SELECT 
        account_id,
        customer_name,
        current_month,
        current_consumption,
        previous_month,
        previous_consumption,
        ROUND(
            CASE 
                WHEN previous_consumption > 0 THEN 
                    ((current_consumption - previous_consumption) / previous_consumption) * 100
                ELSE NULL
            END,
            2
        ) AS percent_change
    FROM pivoted
    ORDER BY account_id;
    `;

    try {
        // Ensure we pass the username parameter safely
        const result = await pool.query(query, [username]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching energy comparison:', error);
        throw new Error('Failed to fetch energy comparison');
    }
};



// Query to get Invoice Summary
// Query to get Invoice Summary
const getInvoiceSummary = async (username) => {
    const query = `
        SELECT 
            ca.account_id,
            ca.customer_name,
            COUNT(ub.entry_id) AS total_invoices,
            COUNT(CASE WHEN ub.invoice_status = 'Paid' THEN 1 END) AS paid_invoices,
            COUNT(CASE WHEN ub.invoice_status = 'Unpaid' AND ub.due_date < CURRENT_DATE THEN 1 END) AS overdue_invoices,
            SUM(CASE WHEN ub.invoice_status = 'Unpaid' THEN ub.total_amount ELSE 0 END) AS outstanding_amount
        FROM 
            customer_account ca
        JOIN 
            usage_and_billing ub ON ca.account_id = ub.account_id
        JOIN
            users u ON u.account_id = ca.account_id
        WHERE 
            ($1 = 'admin' OR u.username = $1)
        GROUP BY 
            ca.account_id, ca.customer_name;
    `;

    try {
        // Ensure we pass the username parameter safely
        const result = await pool.query(query, [username]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching invoice summary:', error);
        throw new Error('Failed to fetch invoice summary');
    }
};










const getcustomerProfile = async (username) => {
  
    const query = `
   SELECT 
  ca.account_id,
  ca.customer_name,
  u.username,
  ca.email,
  ca.phone_number,
  ca.service_address,
  ca.service_type,
  ca.meter_id,
  ca.rate_plan,
  ca.account_status,
  -- Get the most recent billing details for gas, electricity, and total amount
  ub.entry_id,  -- Include entry_id for the latest consumption
  ub.gas_consumption AS latest_gas_consumption,
  ub.electricity_consumption AS latest_electricity_consumption,
  ub.total_amount,
  ub.invoice_status,
  ub.due_date,
  ub.payment_date
FROM users u
JOIN customer_account ca ON u.account_id = ca.account_id
LEFT JOIN usage_and_billing ub 
  ON ca.account_id = ub.account_id
WHERE u.username = $1
ORDER BY ub.period_start DESC, ub.period_end DESC -- Sort by most recent period (start and end dates)
LIMIT 1;
`;



    try {
        const result = await pool.query(query, [username]);
        return result.rows[0] || null; // return null if not found
      } catch (error) {
        console.error('Error fetching customer profile:', error);
        throw error; // Let route handler send the response
      }
    };


 
    const getAllCustomerUsernames = async () => {
        const query = `
          SELECT u.username
          FROM users u
          JOIN customer_account ca ON u.account_id = ca.account_id
          WHERE u.role = 'user';
        `;
        try {
          const result = await pool.query(query);
          return result.rows.map(row => row.username);
        } catch (error) {
          console.error('Error fetching customer usernames:', error);
          throw error;
        }
      };
      

module.exports = { getEnergyConsumption, getEnergyComparison, getInvoiceSummary,getcustomerProfile,getAllCustomerUsernames};
