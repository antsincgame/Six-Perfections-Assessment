require('dotenv').config();

// ॐ मणि पद्मे हूँ - Six Perfections JSON Configuration
// Protected by Mahakala's Diamond Clarity 💎

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',

  // 💎 JSON Data Storage - Blessed by Green Tara
  dataStorage: {
    type: 'json',
    userDataPath: process.env.USER_DATA_PATH || './data/users',
    assessmentDataPath: process.env.ASSESSMENT_DATA_PATH || './data/assessments',
    progressDataPath: process.env.PROGRESS_DATA_PATH || './data/progress',
    backupPath: process.env.BACKUP_PATH || './data/backups',
    enableBackup: process.env.ENABLE_BACKUP !== 'false'
  },

  // JWT configuration (pure JSON authentication)
  jwt: {
    secret: process.env.JWT_SECRET || 'six_perfections_diamond_mind_secret',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
    issuer: 'six-perfections-json',
    audience: 'six-perfections-app'
  },

  // Rate limiting (basic protection)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // CORS configuration (minimal)
  cors: {
    allowedOrigins: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:8001']
  },

  // 💚 Essential Services - Green Tara's swift action
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
      timeout: 5000
    },
    assessment: {
      url: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:8002',
      timeout: 10000
    }
  },

  // 📿 Six Perfections Paramitas - Core wisdom teachings
  paramitas: [
    { 
      id: 'dana', 
      name: 'दान', 
      english: 'Generosity',
      tibetan: 'སྦྱིན་པ་',
      meaning: 'Selfless giving and sharing',
      color: '#4CAF50',
      order: 1
    },
    { 
      id: 'sila', 
      name: 'शील', 
      english: 'Ethics',
      tibetan: 'ཚུལ་ཁྲིམས་',
      meaning: 'Moral conduct and integrity',
      color: '#2196F3',
      order: 2
    },
    { 
      id: 'ksanti', 
      name: 'क्षान्ति', 
      english: 'Patience',
      tibetan: 'བཟོད་པ་',
      meaning: 'Tolerance and forbearance',
      color: '#FF9800',
      order: 3
    },
    { 
      id: 'virya', 
      name: 'वीर्य', 
      english: 'Energy',
      tibetan: 'བརྩོན་འགྲུས་',
      meaning: 'Enthusiastic effort',
      color: '#F44336',
      order: 4
    },
    { 
      id: 'dhyana', 
      name: 'ध्यान', 
      english: 'Meditation',
      tibetan: 'བསམ་གཏན་',
      meaning: 'Mental cultivation and focus',
      color: '#9C27B0',
      order: 5
    },
    { 
      id: 'prajna', 
      name: 'प्रज्ञा', 
      english: 'Wisdom',
      tibetan: 'ཤེས་རབ་',
      meaning: 'Transcendent understanding',
      color: '#FFD700',
      order: 6
    }
  ],

  // Assessment configuration
  assessment: {
    questionsPerParamita: 7,
    totalQuestions: 42,
    timeLimit: 45 * 60 * 1000, // 45 minutes
    scoringMethod: 'weighted',
    languages: ['en', 'ru', 'hi', 'bo']
  },

  // Meditation and practice content
  practices: {
    dailyMeditations: true,
    guidedPractices: true,
    progressTracking: true,
    communityFeatures: false // Initially disabled for JSON version
  }
};

// 🛡️ Mahakala's validation - only essential checks
if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not set, using default (not recommended for production)');
}
}

module.exports = config; 