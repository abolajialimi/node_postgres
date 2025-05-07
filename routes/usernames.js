const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middleware/auth');
const pool = require('../db');

// API route to fetch usernames
router.get('/usernames', checkAdmin, async (req, res) => {
  try {
    const query = `SELECT username FROM users WHERE role = 'user'`;
    const result = await pool.query(query);
    const usernames = result.rows.map(row => row.username);

    res.json(usernames);
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).send('Failed to fetch usernames');
  }
});

module.exports = router;
