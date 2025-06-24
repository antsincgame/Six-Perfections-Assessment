const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// ⚡ Mahakala's Purified Server - Only Essential Components ⚡
const config = require('./config');
const logger = require('./utils/logger');
const { authMiddleware } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

// 🙏 Buddhist blessing for the server
const buddhistBlessing = () => {
  logger.info('🙏 षट्पारमिता - Six Perfections Assessment Server');
  logger.info('📿 ॐ गते गते पारगते पारसंगते बोधि स्वाहा');
  logger.info('🌟 May this server help all beings achieve enlightenment');
  logger.info('🛡️ Protected by Mahakala, guided by Supabase');
};

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// 💎 Diamond-clear security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration (minimal and clean)
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression for efficiency
app.use(compression());

// Body parsing (essential only)
app.use(express.json({ limit: config.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.maxRequestSize }));

// Logging with Buddhist wisdom
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(`🌸 ${message.trim()}`)
  }
}));

// Rate limiting (Patience - क्षान्ति Ksanti)
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'क्षान्ति (Ksanti) - Practice patience, too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
    paramita: 'Please wait and try again with mindfulness'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 💊 Health check endpoint - Medicine Buddha's blessing
app.get('/health', async (req, res) => {
  try {
    // Test Supabase connection if available
    let supabaseStatus = 'not_configured';
    if (config.supabase.enabled) {
      try {
        const { checkSupabaseConnection } = require('./config/supabase');
        const supabaseHealth = await checkSupabaseConnection();
        supabaseStatus = supabaseHealth.status;
      } catch (error) {
        supabaseStatus = 'error';
      }
    }

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'six-perfections-api-gateway',
      version: '1.0.0',
      uptime: Math.floor(process.uptime()),
      supabase: {
        enabled: config.supabase.enabled,
        status: supabaseStatus,
        url: config.supabase.url
      },
      paramitas: config.paramitas,
      blessing: 'सर्वे सत्त्वाः सुखिनो भवन्तु - May all beings be happy 🙏'
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 📿 Six Perfections info endpoint
app.get('/paramitas', (req, res) => {
  res.json({
    title: 'षट्पारमिता - Six Perfections',
    description: 'The Buddhist path to enlightenment through six perfections',
    paramitas: config.paramitas,
    blessing: 'गते गते पारगते पारसंगते बोधि स्वाहा'
  });
});

// API routes with Supabase integration
app.use('/api/v1', routes);

// 404 handler with Buddhist wisdom
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Path not found on the way to enlightenment',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    wisdom: 'प्रज्ञा (Prajna) - Use wisdom to find the correct path'
  });
});

// Global error handler
app.use(errorHandler);

// 🛡️ Mahakala's protection - Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🙏 SIGTERM received, shutting down with gratitude');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🙏 SIGINT received, shutting down mindfully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions  
process.on('uncaughtException', (error) => {
  logger.error('⚠️  Uncaught Exception:', error);
  process.exit(1);
});

const PORT = config.port;
const server = app.listen(PORT, () => {
  buddhistBlessing();
  logger.info(`🌟 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`💊 Health check: http://localhost:${PORT}/health`);
  logger.info(`📿 Paramitas info: http://localhost:${PORT}/paramitas`);
  logger.info(`☁️  Supabase integration: ${config.supabase.enabled ? 'ENABLED' : 'DISABLED'}`);
});

module.exports = { app, server }; 