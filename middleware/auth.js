function checkAdmin(req, res, next) {
    // Ensure the user is authenticated and has a role
    const user = req.session.user;  // Assuming user is stored in session
  
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }

    // Check if the user's role is 'admin'
    if (user.role === 'admin') {
        return next();  // Proceed to the next middleware or route handler
    } else {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
}

module.exports = { checkAdmin };
