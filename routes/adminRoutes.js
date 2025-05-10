// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.renderAdminDashboard);
router.post('/create', adminController.createUsageAndBilling);
router.post('/update', adminController.updateUsageAndBilling);
router.get('/bills', adminController.showBills);
router.post('/bills/pay', adminController.markBillAsPaid);
module.exports = router;