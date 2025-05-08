// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.getDashboard);
router.post('/create', adminController.createUsageAndBilling);
router.post('/update', adminController.updateUsageAndBilling);

module.exports = router;