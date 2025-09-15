const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const { AppError } = require('../utils/errors');
const { asyncHandler } = require('../utils/asyncHandler');
const config = require('../config/config');

const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;

  if (!token) {
    throw new AppError('Access token required', 401);
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // If Supabase is configured, get user from database
    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new AppError('User not found', 401);
      }

      req.user = user;
    } else {
      // Fallback for when Supabase is not configured
      req.user = { id: decoded.userId, email: decoded.email };
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    throw error;
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};