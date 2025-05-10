// controllers/dashboardController.js
const billingModel = require('../models/billingModel');
const pool = require('../config/db');
// Admin dashboard controller
exports.adminDashboard = async (req, res) => {
  try {
    const result = await billingModel.getAdminSummary();
    const summary = result.rows[0];
    res.render('admin/dashboard', {
      username: req.session.user.username,
      summary
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load admin dashboard');
  }
};

// User dashboard controller
exports.userDashboard = async (req, res) => {
  const account_id = req.session.user.account_id;
  try {
    const result = await billingModel.getUserSummary(account_id);
    const summary = result.rows[0];
    res.render('user/dashboard', {
      username: req.session.user.username,
      summary
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load user dashboard');
  }
};
