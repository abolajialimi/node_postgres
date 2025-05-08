// controllers/userController.js
const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const { account_id } = req.session.user;
    const result = await db.query(
      `SELECT u.account_id, u.username, u.email, u.role,
              c.customer_name, c.service_address, c.service_type, c.meter_id,
              ub.billing_month, ub.electricity_consumption, ub.gas_consumption, ub.total_amount, ub.invoice_status
       FROM users u
       JOIN customer_account c ON u.account_id = c.account_id
       JOIN usage_and_billing ub ON c.account_id = ub.account_id
       WHERE u.account_id = $1
       ORDER BY ub.billing_month`,
      [account_id]
    );
    res.render('userDashboard', {
        username: req.session.user.username,
        bills: result.rows
      });
      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.payBill = async (req, res) => {
  const { bill_id } = req.body;
  try {
    await db.query('UPDATE usage_and_billing SET invoice_status = $1 WHERE id = $2', ['Paid', bill_id]);
    res.redirect('/user/dashboard');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
