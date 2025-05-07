// utils/customer.js
const pool = require('../db');
const getcustomerProfile = async (username) => {
    console.log('Fetching profile for:', username); // <-- add this
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
    ub.gas_consumption AS latest_gas_consumption,
    ub.electricity_consumption AS latest_electricity_consumption,
    ub.total_amount,
    ub.invoice_status,
    ub.due_date,
    ub.payment_date
  FROM users u
  JOIN customer_account ca ON u.account_id = ca.account_id
  LEFT JOIN usage_and_billing ub ON ca.account_id = ub.account_id
  WHERE u.username = $1
  ORDER BY ub.payment_date DESC
  LIMIT 1;
`;



    try {
        const result = await pool.query(query, [username]);
        console.log('Query result:', result.rows);
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
      

      const getaccount_id = async () => {
        const query =  'SELECT account_id, customer_name FROM customer_account ORDER BY customer_name';
      
        try {
          const result = await pool.query(query);
          return result.rows.map(row => row.account_id);
        } catch (error) {
          console.error('Error fetching customer account_id:', error);
          throw error;
        }
      };
// module.exports = { getcustomerProfile  };