// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/auth');
const db = require('./config/db');
// Login handler without bcrypt
const bcrypt = require('bcrypt');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
  })
);



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/admin', authMiddleware.requireAdmin, adminRoutes);
app.use('/user', authMiddleware.requireUser, userRoutes);

// Login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// // Login handler
// app.post('/login', async (req, res) => {
//   const { username } = req.body;
//   try {
//     const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];
//     if (!user) return res.redirect('/');
//     req.session.user = { username: user.username, role: user.role, account_id: user.account_id };
//     if (user.role === 'admin') return res.redirect('/admin/dashboard');
//     if (user.role === 'user') return res.redirect('/user/dashboard');
//     res.redirect('/');
//   } catch (err) {
//     console.error(err);
//     res.redirect('/');
//   }
// });


// Login handler
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Get username and password from request body
    
    try {
      // Query the database to find the user by username
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      
      // If no user is found with the given username, redirect to the login page
      if (result.rows.length === 0) {
        return res.redirect('/'); // User doesn't exist
      }
  
      const user = result.rows[0];
  
      // Step 1: Compare the entered password with the stored password (assuming plaintext)
      if (user.password !== password) {
        return res.redirect('/'); // Incorrect password
      }
  
      // Step 2: If the password is correct, create a session for the user
      req.session.user = {
        username: user.username,
        role: user.role,
        account_id: user.account_id
      };
  
      // Step 3: Redirect based on user role
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard'); // Admin role redirect
      }
      if (user.role === 'user') {
        return res.redirect('/user/dashboard'); // User role redirect
      }
  
      // Default redirect if no role matches (shouldn't happen)
      return res.redirect('/');
  
    } catch (err) {
      // Handle any errors
      console.error(err);
      return res.redirect('/'); // Redirect on error
    }
  });
  
  

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));