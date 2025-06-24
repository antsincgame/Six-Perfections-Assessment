// ॐ मणि पद्मे हूँ - Pure JSON Health Check Function
// Protected by Mahakala's Diamond Clarity 💎

const fs = require('fs').promises;
const path = require('path');

// Configuration
const DATA_DIR = process.env.DATA_DIR || '/tmp/six_perfections_data';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

async function checkJsonStorage() {
  try {
    // Test write operation
    const testFile = path.join(DATA_DIR, 'health_test.json');
    const testData = {
      timestamp: new Date().toISOString(),
      test: 'health_check',
      paramita: 'प्रज्ञा (Prajna) - Testing wisdom'
    };
    
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(testFile, JSON.stringify(testData, null, 2));
    
    // Test read operation
    const readData = await fs.readFile(testFile, 'utf8');
    const parsed = JSON.parse(readData);
    
    // Cleanup test file
    await fs.unlink(testFile);
    
    return {
      status: 'healthy',
      writable: true,
      readable: true,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      writable: false,
      readable: false,
      timestamp: new Date().toISOString()
    };
  }
}

async function checkUsersDirectory() {
  try {
    const usersDir = path.join(DATA_DIR, 'users');
    await fs.mkdir(usersDir, { recursive: true });
    
    const files = await fs.readdir(usersDir);
    const userCount = files.filter(f => f.endsWith('.json')).length;
    
    return {
      status: 'healthy',
      userCount,
      directory: 'accessible',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      directory: 'inaccessible',
      timestamp: new Date().toISOString()
    };
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Test JSON storage
    const jsonStorageStatus = await checkJsonStorage();
    const usersStatus = await checkUsersDirectory();
    
    // Determine overall health
    const isHealthy = jsonStorageStatus.status === 'healthy' && 
                     usersStatus.status === 'healthy';
    
    const healthData = {
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      
      // JSON Storage Health
      json_storage: jsonStorageStatus,
      
      // Users Directory Health
      users_system: usersStatus,
      
      // System Information
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      
      // Six Perfections Status
      paramitas: {
        dana: { name: 'दान', english: 'Generosity', status: 'active' },
        sila: { name: 'शील', english: 'Ethics', status: 'active' },
        ksanti: { name: 'क्षान्ति', english: 'Patience', status: 'active' },
        virya: { name: 'वीर्य', english: 'Energy', status: 'active' },
        dhyana: { name: 'ध्यान', english: 'Meditation', status: 'active' },
        prajna: { name: 'प्रज्ञा', english: 'Wisdom', status: 'active' }
      },
      
      // Buddhist Blessing
      buddhist_wisdom: isHealthy 
        ? '🙏 All systems flow with the wisdom of the Six Perfections'
        : '🛠️ May wisdom guide us through technical difficulties',
      
      // Version Information
      version: {
        architecture: 'pure_json',
        database: 'file_based_json',
        authentication: 'jwt_local',
        blessing: 'ॐ मणि पद्मे हूँ'
      }
    };

    return {
      statusCode: isHealthy ? 200 : 503,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(healthData, null, 2)
    };

  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        buddhist_wisdom: '🙏 May difficulties lead to greater wisdom'
      }, null, 2)
    };
  }
}; 