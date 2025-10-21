const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { serverStartTime } = require('../utils/serverSession');

// Protect routes - authenticate user
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token was issued before server restart
      if (decoded.iat * 1000 < serverStartTime) {
        return res.status(401).json({ 
          message: 'Session expired due to server restart. Please login again.',
          serverRestart: true 
        });
      }

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please login again.' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// HR or Admin middleware
exports.hrOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'hr')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. HR or Admin access required.' });
  }
};

// Admin or Manager middleware
exports.adminOrManager = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or Manager only.' });
  }
};

// HR, Manager, or Admin middleware
exports.hrManagerOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'hr', 'manager'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. HR, Manager, or Admin access required.' });
  }
};

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h' // Changed from 30d to 24h for better security
  });
};
