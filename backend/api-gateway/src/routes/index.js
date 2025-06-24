const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Middleware для логирования запросов к микросервисам
const requestLogger = (serviceName) => (req, res, next) => {
  logger.info(`Proxying ${req.method} ${req.path} to ${serviceName} service`);
  next();
};

// Proxy options с обработкой ошибок
const createProxyOptions = (serviceName, serviceConfig) => ({
  target: serviceConfig.url,
  changeOrigin: true,
  timeout: serviceConfig.timeout,
  pathRewrite: {
    [`^/api/v1/${serviceName}`]: ''
  },
  onError: (err, req, res) => {
    logger.error(`Proxy error for ${serviceName} service:`, err.message);
    res.status(503).json({
      error: 'Service temporarily unavailable',
      code: 'SERVICE_UNAVAILABLE',
      service: serviceName
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Добавляем заголовки для трассировки
    proxyReq.setHeader('X-Request-ID', req.headers['x-request-id'] || 'unknown');
    proxyReq.setHeader('X-Forwarded-For', req.ip);
    proxyReq.setHeader('X-Gateway-Version', '1.0.0');
    
    // Логируем успешные проксированные запросы
    logger.debug(`Proxying ${req.method} ${req.path} to ${serviceName}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Добавляем заголовки ответа
    proxyRes.headers['X-Served-By'] = 'six-perfections-gateway';
    proxyRes.headers['X-Service'] = serviceName;
  }
});

// Authentication routes (no auth required)
router.use('/auth', 
  requestLogger('auth'),
  createProxyMiddleware(createProxyOptions('auth', config.services.auth))
);

// Protected routes requiring authentication
const protectedRoutes = [
  { path: '/users', service: 'user' },
  { path: '/assessments', service: 'assessment' },
  { path: '/scores', service: 'assessment' },
  { path: '/training', service: 'assessment' },
  { path: '/progress', service: 'assessment' },
  { path: '/content', service: 'content' },
  { path: '/meditations', service: 'content' },
  { path: '/analytics', service: 'analytics' },
  { path: '/notifications', service: 'notification' },
  { path: '/community', service: 'user' },
  { path: '/payments', service: 'user' }
];

// Apply authentication middleware to protected routes
protectedRoutes.forEach(({ path, service }) => {
  router.use(path,
    authMiddleware,
    requestLogger(service),
    createProxyMiddleware(createProxyOptions(service, config.services[service]))
  );
});

// Research routes (special handling for anonymized data)
router.use('/research',
  authMiddleware,
  (req, res, next) => {
    // Проверяем права на доступ к исследовательским данным
    if (!req.user.roles || !req.user.roles.includes('researcher')) {
      return res.status(403).json({
        error: 'Access denied. Researcher role required.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  },
  requestLogger('analytics'),
  createProxyMiddleware(createProxyOptions('research', config.services.analytics))
);

// Admin routes (highest level access)
router.use('/admin',
  authMiddleware,
  (req, res, next) => {
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      return res.status(403).json({
        error: 'Access denied. Admin role required.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    next();
  },
  requestLogger('admin'),
  createProxyMiddleware({
    target: config.services.user.url,
    changeOrigin: true,
    timeout: config.services.user.timeout,
    pathRewrite: {
      '^/api/v1/admin': '/admin'
    }
  })
);

// Health check for all services
router.get('/health/services', async (req, res) => {
  const axios = require('axios');
  const serviceHealthChecks = {};

  const checkService = async (serviceName, serviceConfig) => {
    try {
      const response = await axios.get(`${serviceConfig.url}/health`, {
        timeout: 3000
      });
      return {
        status: 'healthy',
        responseTime: response.headers['x-response-time'] || 'unknown',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  };

  // Check all services in parallel
  const healthPromises = Object.entries(config.services).map(
    async ([serviceName, serviceConfig]) => {
      const health = await checkService(serviceName, serviceConfig);
      serviceHealthChecks[serviceName] = health;
    }
  );

  await Promise.all(healthPromises);

  const overallStatus = Object.values(serviceHealthChecks).every(
    service => service.status === 'healthy'
  ) ? 'healthy' : 'degraded';

  res.status(overallStatus === 'healthy' ? 200 : 503).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: serviceHealthChecks
  });
});

// API version info
router.get('/version', (req, res) => {
  res.json({
    service: 'api-gateway',
    version: '1.0.0',
    apiVersion: 'v1',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    supportedServices: Object.keys(config.services)
  });
});

module.exports = router; 