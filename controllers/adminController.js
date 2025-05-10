// controllers/adminController.js
const db = require('../config/db');
// controllers/adminController.js
const billingModel = require('../models/billingModel');


exports.renderAdminDashboard = async (req, res) => {
  try {
    const summaryQuery = await db.query(`
      SELECT 
        SUM(electricity_consumption) AS total_electricity,
        SUM(gas_consumption) AS total_gas,
        SUM(total_amount) AS total_invoice
      FROM usage_and_billing
    `);

    const dataQuery = await db.query(`
      SELECT *
      FROM usage_and_billing
      ORDER BY  billing_month
    `);

    const summary = summaryQuery.rows[0];
    const bills = dataQuery.rows;

    const labels = bills.map(b => b.billing_month);
    const electricityData = bills.map(b => b.electricity_consumption);
    const gasData = bills.map(b => b.gas_consumption);

    const statusSummary = bills.reduce((acc, b) => {
      acc[b.invoice_status] = (acc[b.invoice_status] || 0) + 1;
      return acc;
    }, {});

    


    res.render('adminDashboard', {
      username: req.session.user.username,
      summary,
      bills,
      labels: JSON.stringify(labels),
      electricityData: JSON.stringify(electricityData),
      gasData: JSON.stringify(gasData),
      statusSummary: JSON.stringify(statusSummary)
    });
  } catch (err) {
    console.error('Error fetching admin dashboard data:', err);
    res.status(500).send('Server error');
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




// Show all bills
exports.showBills = async (req, res) => {
  try {
    const result = await billingModel.getAllBills();
    const bills = result.rows;
    res.render('admin/bills', { bills }); // Assumes you have a 'bills.ejs'
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving billing data');
  }
};

// Mark a bill as paid
exports.markBillAsPaid = async (req, res) => {
  const { bill_id } = req.body;
  try {
    await billingModel.updateBillStatus(bill_id);
    res.redirect('/admin/bills'); // Go back to bill list
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update bill');
  }
};

