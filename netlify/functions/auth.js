// ॐ मणि पद्मे हूँ - Pure JSON Authentication Functions
// Protected by Mahakala's Diamond Clarity 💎

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'six_perfections_diamond_mind_secret';
const DATA_DIR = process.env.DATA_DIR || '/tmp/six_perfections_data';

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(DATA_DIR, 'users'), { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Helper functions for user data management
async function saveUser(user) {
  await ensureDataDir();
  const userFile = path.join(DATA_DIR, 'users', `${user.id}.json`);
  await fs.writeFile(userFile, JSON.stringify(user, null, 2));
}

async function loadUser(userId) {
  try {
    const userFile = path.join(DATA_DIR, 'users', `${userId}.json`);
    const userData = await fs.readFile(userFile, 'utf8');
    return JSON.parse(userData);
  } catch (error) {
    return null;
  }
}

async function findUserByEmail(email) {
  try {
    await ensureDataDir();
    const usersDir = path.join(DATA_DIR, 'users');
    const files = await fs.readdir(usersDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const userData = await fs.readFile(path.join(usersDir, file), 'utf8');
        const user = JSON.parse(userData);
        if (user.email === email) {
          return user;
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

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
    const action = event.queryStringParameters?.action || 'unknown';
    const method = event.httpMethod;

    // Registration endpoint
    if (action === 'register' && method === 'POST') {
      const { email, password, firstName, lastName, spiritualLevel, languagePreference } = JSON.parse(event.body);

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields',
            message: 'Email, password, first name, and last name are required',
            buddhist_wisdom: '🙏 Right intention requires complete preparation'
          })
        };
      }

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'User already exists',
            message: 'An account with this email already exists',
            buddhist_wisdom: '♻️ All beings return to the path in their own time'
          })
        };
      }

      // Create new user
      const userId = crypto.randomUUID();
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newUser = {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        spiritualLevel: spiritualLevel || 'beginner',
        languagePreference: languagePreference || 'en',
        status: 'active',
        joinedAt: new Date().toISOString(),
        paramitaProgress: {
          dana: 0,
          sila: 0,
          ksanti: 0,
          virya: 0,
          dhyana: 0,
          prajna: 0
        },
        assessmentHistory: [],
        lastLogin: new Date().toISOString()
      };

      await saveUser(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id,
          email: newUser.email,
          spiritualLevel: newUser.spiritualLevel
        },
        JWT_SECRET,
        { expiresIn: '7d', issuer: 'six-perfections-json' }
      );

      // Return user data (without password)
      const { password: _, ...userResponse } = newUser;

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Registration successful',
          token,
          user: userResponse,
          buddhist_wisdom: '🌱 A new journey on the path to enlightenment begins'
        })
      };
    }

    // Login endpoint
    if (action === 'login' && method === 'POST') {
      const { email, password } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Missing credentials',
            message: 'Email and password are required',
            buddhist_wisdom: '🔑 Right effort requires complete preparation'
          })
        };
      }

      // Find user by email
      const user = await findUserByEmail(email);
      if (!user) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Invalid credentials',
            message: 'No account found with this email',
            buddhist_wisdom: '🧭 May you find the right path to enlightenment'
          })
        };
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Invalid credentials',
            message: 'Incorrect password',
            buddhist_wisdom: '🗝️ Wisdom comes through right understanding'
          })
        };
      }

      // Check account status
      if (user.status !== 'active') {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Account inactive',
            message: 'Your account has been deactivated',
            buddhist_wisdom: '🌱 May your path to enlightenment be renewed'
          })
        };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      await saveUser(user);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          spiritualLevel: user.spiritualLevel
        },
        JWT_SECRET,
        { expiresIn: '7d', issuer: 'six-perfections-json' }
      );

      // Return user data (without password)
      const { password: _, ...userResponse } = user;

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          token,
          user: userResponse,
          buddhist_wisdom: '🙏 Welcome back to your path of spiritual development'
        })
      };
    }

    // Get current user endpoint
    if (action === 'me' && method === 'GET') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'No token provided',
            message: 'Authorization token is required',
            buddhist_wisdom: '🔐 Identification is required on the path'
          })
        };
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await loadUser(decoded.userId);
        if (!user) {
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({
              success: false,
              error: 'User not found',
              message: 'Invalid token - user no longer exists',
              buddhist_wisdom: '📿 All formations are impermanent'
            })
          };
        }

        // Return user data (without password)
        const { password: _, ...userResponse } = user;

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            user: userResponse
          })
        };

      } catch (error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Invalid token',
            message: 'Authentication token is invalid or expired',
            buddhist_wisdom: '⏰ All things arise and pass away in their own time'
          })
        };
      }
    }

    // Logout endpoint (mainly for cleanup)
    if (action === 'logout' && method === 'POST') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Logged out successfully',
          buddhist_wisdom: '🙏 May your practice continue with mindfulness'
        })
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Route not found',
        message: 'The requested authentication endpoint does not exist',
        buddhist_wisdom: '🧭 May you find the right path'
      })
    };

  } catch (error) {
    console.error('Authentication function error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        buddhist_wisdom: '🙏 May difficulties lead to greater wisdom'
      })
    };
  }
}; 