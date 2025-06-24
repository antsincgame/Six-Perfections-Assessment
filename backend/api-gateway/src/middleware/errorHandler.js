const logger = require('../utils/logger');
const config = require('../config');

/**
 * Global error handler middleware
 * Catches and formats all unhandled errors
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Default error response
  let status = 500;
  let response = {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    response = {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.details || err.message,
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    status = 401;
    response = {
      error: 'Unauthorized access',
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  if (err.name === 'ForbiddenError' || err.status === 403) {
    status = 403;
    response = {
      error: 'Access forbidden',
      code: 'FORBIDDEN',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  if (err.name === 'NotFoundError' || err.status === 404) {
    status = 404;
    response = {
      error: 'Resource not found',
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    status = 429;
    response = {
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.retryAfter || 60,
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Service unavailable errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    status = 503;
    response = {
      error: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Request timeout errors
  if (err.code === 'ETIMEDOUT' || err.timeout) {
    status = 504;
    response = {
      error: 'Request timeout',
      code: 'GATEWAY_TIMEOUT',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Payload too large errors
  if (err.type === 'entity.too.large') {
    status = 413;
    response = {
      error: 'Request payload too large',
      code: 'PAYLOAD_TOO_LARGE',
      limit: config.maxRequestSize,
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Add request ID if available
  if (req.headers['x-request-id']) {
    response.requestId = req.headers['x-request-id'];
  }

  // Add debug information in development mode
  if (config.nodeEnv === 'development') {
    response.debug = {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    };
  }

  // Add correlation ID for tracking
  response.correlationId = req.correlationId || `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Send error response
  res.status(status).json(response);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  logger.warn('Route not found:', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /health',
      'GET /api/v1/version',
      'GET /api/v1/health/services',
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/register',
      // Add more endpoints as needed
    ]
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch promise rejections
 */
const asyncErrorWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncErrorWrapper
}; 