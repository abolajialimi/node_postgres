require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const bodyParser = require('body-parser');
const pool = require('./db.js');
const sessionRoutes = require('./routes/session');
const usernameRoutes = require('./routes/usernames.js');
const billingRoutes = require('./routes/billing');
const dashboardRoutes = require('./routes/dashboard');
const customerRoutes = require('./routes/customer');
const billingEntryRoutes = require('./routes/billingentry'); // ✅ Correct path




const app = express();

// Session configuration
app.use(session({
  secret: 'myTemporarySecret123!',  // Use a secret key, ideally from .env in production
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 30, // 30 minutes expiration
    secure: process.env.NODE_ENV === 'production' // Only true in production
  }
}));

// Body parsers for form and JSON
app.use(express.json());  // Built-in Express JSON parser
app.use(express.urlencoded({ extended: true }));  // Built-in Express URL-encoded parser

// Serve static files (JS, CSS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages'))); // Serving pages directory

// Example user data (replace with DB in production)
const users = [
  { username: 'admin', password: 'password', role: 'admin' },
  { username: 'lgreen', password: 'linda#2025', role: 'user' }
];

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username and password
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Store user session
    req.session.user = { username: user.username, role: user.role };

    // Redirect to the corresponding dashboard
    const targetPage = user.role === 'admin' ? 'admin.html' : 'user.html';
    res.redirect(`/${targetPage}?username=${encodeURIComponent(username)}`);
  } else {
    // Invalid login credentials
    res.redirect('/?error=Invalid%20credentials');
  }
});

// Example redirect if already logged in (optional)
app.get('/login', (req, res) => {
  if (req.session.user) {
    const targetPage = req.session.user.role === 'admin' ? 'admin.html' : 'user.html';
    return res.redirect(`/${targetPage}?username=${encodeURIComponent(req.session.user.username)}`);
  } else {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
  }
});

// Middleware to check if the user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/');
  }
}

// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  } else {
    res.status(403).send('Forbidden');
  }
}

// Serve admin page (Only accessible if authenticated as admin)
app.get('/admin', checkAuth, checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/admin.html'));
});

// Serve user page (Only accessible if authenticated as user)
app.get('/user', checkAuth, (req, res) => {
  if (req.session.user.role === 'user') {
    res.sendFile(path.join(__dirname, 'pages/user.html'));
  } else {
    res.status(403).send('Forbidden');
  }
});

// API routes

app.use('/api', usernameRoutes);
// Return session user info

app.use('/api', sessionRoutes);

app.use('/api', dashboardRoutes);
app.use('/api', customerRoutes); 
// Mount your route under /api
app.use('/api', billingEntryRoutes); // ✅ This exposes /api/billing-entry
app.use('/api', billingRoutes);

// Serve billing HTML page from "pages" folder
app.get('/billing', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'admin.html'));
});
// Catch-all route for unknown paths
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});