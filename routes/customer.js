const express = require('express');
const router = express.Router();
// const { getcustomerProfile } = require('../utils/customer');
const { getcustomerProfile ,getAllCustomerUsernames} = require('../queries');

router.get('/customer-profile', async (req, res) => {
  const { username } = req.query;
  console.log('Received username:', username);  // Check if
  if (!username) return res.status(400).send('Username required');

  try {
    const profile = await getcustomerProfile(username);
    console.log('Received profile:',profile);  // Check if the profile data is returned
    if (!profile) return res.status(404).send('Customer not found');
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error');
  }
});




router.get('/usernames', async (req, res) => {
  try {
    const usernames = await getAllCustomerUsernames();
    res.json(usernames);
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
