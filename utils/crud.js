// Import the functions in your crud.js (this should already be there)
const  pool  = require('../db');

// Function to get a billing entry
async function getBillingEntry(account_id, period_start, period_end) {
  try {
    const res = await pool.query(
      `SELECT * FROM usage_and_billing WHERE account_id = $1 AND period_start = $2 AND period_end = $3`,
      [account_id, period_start, period_end]
    );
    return res.rows[0]; // Return the first matching entry
  } catch (err) {
    throw new Error(`Error fetching billing entry: ${err.message}`);
  }
}


// Function to get a  entry
async function getEntry(account_id, period_start, period_end) {
    try {
        const res = await pool.query(
            `SELECT entry_id FROM usage_and_billing 
             WHERE account_id = $1 
               AND period_start = $2 
               AND period_end = $3`,
            [account_id, period_start, period_end]
          );
      return res.rows[0]; // Return the first matching entry
    } catch (err) {
      throw new Error(`Error fetching billing entry: ${err.message}`);
    }
  }
  
  











// Function to update a billing entry
async function updateBillingEntry(entry) {
  const {
    entry_id,
    gas_consumption,
    electricity_consumption,
    total_amount,
    invoice_status,
    due_date,
    payment_date,
  } = entry;

  try {
    await pool.query(
      `UPDATE usage_and_billing SET
         gas_consumption = $1,
         electricity_consumption = $2,
         total_amount = $3,
         invoice_status = $4,
         due_date = $5,
         payment_date = $6
       WHERE id = $7`,
      [
        gas_consumption,
        electricity_consumption,
        total_amount,
        invoice_status,
        due_date,
        payment_date,
        entry_id,
      ]
    );
  } catch (err) {
    throw new Error(`Error updating billing entry: ${err.message}`);
  }
}

// Function to delete a billing entry
async function deleteBillingEntry(entry_id) {
    try {
      const result = await pool.query(
        `DELETE FROM usage_and_billing WHERE entry_id = $1 RETURNING *`,
        [entry_id]
      );
  
      if (result.rowCount === 0) {
        throw new Error('Billing entry not found for deletion');
      }
  
      return result.rows[0]; // Return deleted entry
    } catch (err) {
      throw new Error(`Error deleting billing entry: ${err.message}`);
    }
  }
  

// Helper function to validate UUID format
function isValidUUID(uuid) {
const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
return regex.test(uuid);
}
module.exports = {
  getBillingEntry,
  updateBillingEntry,
  deleteBillingEntry,getEntry
};
