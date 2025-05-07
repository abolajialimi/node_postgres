const { randomUUID } = require('crypto');
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { checkAdmin } = require('../middleware/auth');

// Utility to get billing period start/end
function getBillingPeriod(billingMonth) {
  const start = new Date(`${billingMonth}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);

  const format = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;

  return {
    period_start: format(start),
    period_end: format(end),
  };
}


// Admin-only create or update
router.post('/billing', checkAdmin, async (req, res) => {
  try {
    const {
      account_id,
      billing_month,
      gas_consumption = 0,
      electricity_consumption = 0,
      invoice_status,
      due_date,
      payment_date
    } = req.body;

  

    const { period_start, period_end } = getBillingPeriod(billing_month);
    
    

    // Rates (can also come from config or DB later)
    const gasRate = 0.8;
    const electricityRate = 0.12;

    // Calculated costs
    const gas_amount = parseFloat((gas_consumption * gasRate).toFixed(2));
    const electricity_amount = parseFloat((electricity_consumption * electricityRate).toFixed(2));
    const total_amount = parseFloat((gas_amount + electricity_amount).toFixed(2));


    console.log('Billing payload:', req.body);



   
  
    // Check for existing entry
    const existing = await pool.query(
      `SELECT entry_id FROM usage_and_billing
       WHERE account_id = $1 AND period_start = $2 AND period_end = $3`,
      [account_id, period_start, period_end]
    );

    let entryIdToUse = existing.rows[0]?.entry_id || randomUUID();

    if (existing.rows.length > 0) {
      // UPDATE
      await pool.query(
        `UPDATE usage_and_billing
         SET gas_consumption = $1,
             electricity_consumption = $2,
             gas_amount = $3,
             electricity_amount = $4,
             total_amount = $5,
             invoice_status = $6,
             due_date = $7,
             payment_date = $8
         WHERE entry_id = $9`,
        [
          gas_consumption,
          electricity_consumption,
          gas_amount,
          electricity_amount,
          total_amount,
          invoice_status,
          due_date,
          payment_date,
          entryIdToUse
        ]
      );
      return res.json({ message: 'Billing entry updated.' });
    } else {
      // CREATE
      await pool.query(
        `INSERT INTO usage_and_billing (
          entry_id, account_id, period_start, period_end,
          gas_consumption, electricity_consumption,
          gas_amount, electricity_amount,
          total_amount, invoice_status, due_date, payment_date
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          entryIdToUse,
          account_id,
          period_start,
          period_end,
          gas_consumption,
          electricity_consumption,
          gas_amount,
          electricity_amount,
          total_amount,
          invoice_status,
          due_date,
          payment_date
        ]
      );
      return res.status(201).json({ message: 'Billing entry created.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating/updating billing' });
  }
});


module.exports = router;
