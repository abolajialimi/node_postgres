const express = require('express');
const { checkAdmin } = require('../middleware/auth'); // Ensure you import the checkAdmin middleware
const router = express.Router();
const { getEnergyConsumption, getEnergyComparison, getInvoiceSummary } = require('../queries');
const pool = require('../db');

router.get('/dashboard',checkAdmin, async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send('Unauthorized');

  try {
    if (user.role === 'admin') {
      const result = await pool.query(`SELECT username FROM users WHERE role = 'user'`);
      const usernames = result.rows.map(r => r.username);

      const energyConsumption = await Promise.all(usernames.map(getEnergyConsumption));
      const energyComparison = await Promise.all(usernames.map(getEnergyComparison));
      const invoiceSummary = await Promise.all(usernames.map(getInvoiceSummary));

      return res.json({ energyConsumption, energyComparison, invoiceSummary });
    } else {
      const { username } = user;
      const energyConsumption = await getEnergyConsumption(username);
      const energyComparison = await getEnergyComparison(username);
      const invoiceSummary = await getInvoiceSummary(username);

      return res.json({ energyConsumption, energyComparison, invoiceSummary });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).send('Failed to load dashboard data');
  }
});

module.exports = router;
