// middleware/auth.js
function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/');
}

function requireUser(req, res, next) {
  if (req.session.user && req.session.user.role === 'user') {
    return next();
  }
  res.redirect('/');
}

module.exports = { requireAdmin, requireUser };
