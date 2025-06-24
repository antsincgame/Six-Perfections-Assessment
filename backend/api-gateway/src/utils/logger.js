const winston = require('winston');
const config = require('../config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service = 'api-gateway', ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      service,
      message,
      ...meta
    });
  })
);

// Define log transports
const transports = [
  new winston.transports.Console({
    format: config.nodeEnv === 'development' 
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      : logFormat
  })
];

// Add file transports in production
if (config.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.monitoring.logLevel || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'api-gateway',
    version: '1.0.0'
  },
  transports,
  exitOnError: false
});

// Add methods for structured logging
logger.apiCall = (method, path, statusCode, responseTime, userId = null) => {
  logger.info('API Call', {
    type: 'api_call',
    method,
    path,
    statusCode,
    responseTime: `${responseTime}ms`,
    userId
  });
};

logger.serviceCall = (service, method, path, statusCode, responseTime) => {
  logger.info('Service Call', {
    type: 'service_call',
    service,
    method,
    path,
    statusCode,
    responseTime: `${responseTime}ms`
  });
};

logger.authentication = (userId, success, reason = null, ip = null) => {
  logger.info('Authentication Event', {
    type: 'authentication',
    userId,
    success,
    reason,
    ip
  });
};

logger.rateLimitHit = (ip, path, limit) => {
  logger.warn('Rate Limit Hit', {
    type: 'rate_limit',
    ip,
    path,
    limit
  });
};

logger.securityEvent = (event, details, severity = 'medium') => {
  logger.warn('Security Event', {
    type: 'security',
    event,
    severity,
    ...details
  });
};

// Handle uncaught exceptions and unhandled rejections
if (config.nodeEnv === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({ 
      filename: 'logs/exceptions.log',
      format: logFormat
    })
  );

  logger.rejections.handle(
    new winston.transports.File({ 
      filename: 'logs/rejections.log',
      format: logFormat
    })
  );
}

module.exports = logger; 