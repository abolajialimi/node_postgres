// controllers/adminController.js
const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usage_and_billing ORDER BY account_id, billing_month');
    res.render('adminDashboard', { data: result.rows });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUsageAndBilling = async (req, res) => {
  const { account_id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status } = req.body;
  try {
    await db.query(
      `INSERT INTO usage_and_billing (account_id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [account_id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status]
    );
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUsageAndBilling = async (req, res) => {
  const { id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status } = req.body;
  try {
    await db.query(
      `UPDATE usage_and_billing SET billing_month=$2, electricity_consumption=$3, gas_consumption=$4, total_amount=$5, invoice_status=$6 WHERE id=$1`,
      [id, billing_month, electricity_consumption, gas_consumption, total_amount, invoice_status]
    );
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};