
const db = require('../config/db');

// models/billingModel.js


exports.getAllBills = async () => {
  return db.query('SELECT * FROM usage_and_billing');
};

exports.updateBillStatus = async (bill_id) => {
  return db.query('UPDATE usage_and_billing SET invoice_status = $1 WHERE id = $2', ['Paid', bill_id]);
};

// models/billingModel.js

