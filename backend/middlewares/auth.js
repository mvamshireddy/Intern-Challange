const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user using JWT
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize user based on role(s)
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorize };