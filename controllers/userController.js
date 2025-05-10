// controllers/userController.js
const db = require('../config/db');
const Billing = require('../models/billingModel');


exports.renderUserDashboard = async (req, res) => {
  try {
    const accountId = req.session.user.account_id;

    // Summarized totals
    const summaryQuery = await db.query(`
      SELECT 
        SUM(electricity_consumption) AS total_electricity,
        SUM(gas_consumption) AS total_gas,
        SUM(total_amount) AS total_invoice
      FROM usage_and_billing
      WHERE account_id = $1
    `, [accountId]);

    // Detailed billing data
    const dataQuery = await db.query(`
      SELECT  u.account_id, u.username, u.email, u.role,
             c.customer_name, c.service_address, c.service_type, c.meter_id,
             ub.id AS id,  
             ub.billing_month, ub.electricity_consumption, ub.gas_consumption, ub.total_amount, ub.invoice_status
      FROM users u
      JOIN customer_account c ON u.account_id = c.account_id
      JOIN usage_and_billing ub ON c.account_id = ub.account_id
      WHERE u.account_id = $1
      ORDER BY ub.billing_month
    `, [accountId]);

    const summary = summaryQuery.rows[0];
    const bills = dataQuery.rows;

    // Prepare data for charts
    const labels = bills.map(b => b.billing_month);
    const electricityData = bills.map(b => b.electricity_consumption);
    const gasData = bills.map(b => b.gas_consumption);

    const statusSummary = bills.reduce((acc, b) => {
      acc[b.invoice_status] = (acc[b.invoice_status] || 0) + 1;
      return acc;
    }, {});
    const customerProfile = {
      name: bills[0].customer_name,
      address: bills[0].service_address,
      type: bills[0].service_type,
      meter: bills[0].meter_id
    };

    res.render('userDashboard', {
      username: req.session.user.username,
      account_id: accountId,
      summary,
      bills,
      labels: JSON.stringify(labels),
      electricityData: JSON.stringify(electricityData),
      gasData: JSON.stringify(gasData),
      statusSummary: JSON.stringify(statusSummary),
      customerProfile
    });

  } catch (err) {
    console.error('Error fetching user dashboard:', err);
    res.status(500).send('Server error');
  }
};





exports.payBill = async (req, res) => {
  let { bill_id } = req.body;
  console.log("Received bill_id:", bill_id);

  bill_id = parseInt(bill_id);

  if (!bill_id || isNaN(bill_id)) {
    return res.status(400).json({ error: 'Invalid bill ID' });
  }

  try {
    const result = await db.query(
      'UPDATE usage_and_billing SET invoice_status = $1 WHERE id = $2 RETURNING *',
      ['Paid', bill_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

