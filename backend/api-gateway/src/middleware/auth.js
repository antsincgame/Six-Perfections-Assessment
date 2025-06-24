const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * JWT Authentication Middleware with JSON File Storage
 * Pure JSON authentication blessed by Six Perfections (षट्पारमिता) 🙏
 * Protected by Mahakala's Diamond Clarity 💎
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No valid authorization token provided',
        message: 'Access denied - Please authenticate first',
        buddhist_wisdom: '🙏 May wisdom guide your path to enlightenment'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Load user data from JSON file
    const userData = await loadUserFromJSON(decoded.userId);
    
    if (!userData) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Invalid token - user no longer exists',
        buddhist_wisdom: '📿 All formations are impermanent'
      });
    }

    // Check if user account is active
    if (userData.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account inactive',
        message: 'Your account has been deactivated',
        buddhist_wisdom: '🌱 May your path to enlightenment be renewed'
      });
    }

    // Add user info to request
    req.user = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      spiritualLevel: userData.spiritualLevel,
      languagePreference: userData.languagePreference,
      joinedAt: userData.joinedAt,
      paramitaProgress: userData.paramitaProgress || {}
    };

    req.tokenInfo = {
      issued: decoded.iat,
      expires: decoded.exp,
      issuer: decoded.iss
    };

    logger.info('Authentication successful', {
      userId: req.user.id,
      email: req.user.email,
      spiritualLevel: req.user.spiritualLevel
    });

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Authentication token is malformed',
        buddhist_wisdom: '💎 Seek clarity through right understanding'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Authentication token has expired',
        buddhist_wisdom: '⏰ All things arise and pass away in their own time'
      });
    }

    logger.error('Authentication middleware error:', error);

    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Internal authentication failure',
      buddhist_wisdom: '🙏 May difficulties lead to greater wisdom'
    });
  }
};

/**
 * Load user data from JSON file storage
 * @param {string} userId - User ID to load
 * @returns {Object|null} User data or null if not found
 */
async function loadUserFromJSON(userId) {
  try {
    const userFilePath = path.join(config.dataStorage.userDataPath, `${userId}.json`);
    const userDataRaw = await fs.readFile(userFilePath, 'utf8');
    return JSON.parse(userDataRaw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn(`User file not found: ${userId}`);
      return null;
    }
    logger.error('Error loading user from JSON:', error);
    throw error;
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for endpoints that work both with and without authentication
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No authentication provided, continue without user info
      req.user = null;
      return next();
    }

    // Use the main auth middleware logic
    await authMiddleware(req, res, next);
    
  } catch (error) {
    // On authentication error in optional mode, continue without user
    logger.info('Optional authentication failed, continuing without user');
    req.user = null;
    next();
  }
};

/**
 * Admin-only authentication middleware
 * Requires both valid authentication and admin privileges
 */
const adminAuthMiddleware = async (req, res, next) => {
  // First run regular authentication
  await authMiddleware(req, res, (error) => {
    if (error) return next(error);
    
    // Check if user has admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
        message: 'This endpoint requires administrator privileges',
        buddhist_wisdom: '👑 With great power comes great responsibility'
      });
    }
    
    next();
  });
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  adminAuthMiddleware,
  loadUserFromJSON
}; 