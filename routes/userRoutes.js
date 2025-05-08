// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard', userController.getDashboard);
router.post('/pay', userController.payBill);

module.exports = router;