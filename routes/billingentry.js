const express = require('express');
const { getBillingEntry, updateBillingEntry, deleteBillingEntry,getEntry } = require('../utils/crud');

const router = express.Router();

// Route to get entry_id for a given account_id and billing period
router.post('/entry-id', async (req, res) => {
    const { account_id, period_start, period_end } = req.body;
  
    try {
      const entry = await getEntry(account_id, period_start, period_end);
      if (entry) {
        res.json(entry); // e.g., { entry_id: 'uuid' }
      } else {
        res.status(404).json({ message: 'Entry not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.post('/billing-entry', async (req, res) => {
    const { account_id, period_start, period_end } = req.body;
    console.log('Request Body:', req.body); // Log inputs
  
    try {
      const entry = await getBillingEntry(account_id, period_start, period_end);
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.json(entry);
    } catch (err) {
      console.error('Error loading entry:', err); // Full error trace
      res.status(500).json({ message: 'Error loading entry', error: err.message });
    }
  });

// In routes/billingentry.js or your router file
router.post('/entry-id', async (req, res) => {
    const { account_id, start, end } = req.body;
  
    try {
      const entry = await getBillingEntry(account_id, start, end);
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
  
      res.json({ entry_id: entry.entry_id }); // adjust to actual key name
    } catch (err) {
      console.error('Error fetching entry ID:', err);
      res.status(500).json({ message: 'Error fetching entry ID', error: err.message });
    }
  });
  
// 🔹 Update billing entry using PUT and entry_id in the route
router.put('/billing/:entry_id', async (req, res) => {
  const { entry_id } = req.params;
  const {
    gas_consumption,
    electricity_consumption,
    total_amount,
    invoice_status,
    due_date,
    payment_date
  } = req.body;

  try {
    await updateBillingEntry({
      entry_id,
      gas_consumption,
      electricity_consumption,
      total_amount,
      invoice_status,
      due_date,
      payment_date,
    });
    res.status(200).json({ message: 'Billing entry updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 Delete billing entry using DELETE and entry_id in the route
router.delete('/billing/:entry_id', async (req, res) => {
    const { entry_id } = req.params;
  
    try {
      const deletedEntry = await deleteBillingEntry(entry_id);
      res.status(200).json({ message: 'Deleted successfully', deletedEntry });
    } catch (error) {
      res.status(404).json({ message: error.message }); // return 404 if not found
    }
  });
  // In billing-entry.js or another router file
router.get('/billing-entries/:account_id', async (req, res) => {
    const { account_id } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT entry_id, period_start, period_end, total_amount FROM usage_and_billing WHERE account_id = $1 ORDER BY period_start DESC`,
        [account_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
