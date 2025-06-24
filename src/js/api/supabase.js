// ॐ तारे तुत्तारे तुरे स्वाहा - Supabase API Integration
// Pure JavaScript connection to Supabase - No bundlers needed
// Green Tara protects this sacred connection 💚

class SupabaseClient {
  constructor() {
    this.url = 'https://qkrcohrfsidbwhmkcppb.supabase.co';
    this.anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcmNvaHJmc2lkYndobWtjcHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTY1NTEsImV4cCI6MjA2NjMzMjU1MX0.5cqiyqrVAb0gz4PK7G7jiHg4bW70POYq_Dkq_h9Xdt0';
    this.session = null;
    
    // Load session from localStorage
    this.loadSession();
  }

  // HTTP request helper
  async request(endpoint, options = {}) {
    const url = `${this.url}/rest/v1${endpoint}`;
    const headers = {
      'apikey': this.anonKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    };

    if (this.session?.access_token) {
      headers['Authorization'] = `Bearer ${this.session.access_token}`;
    }

    const config = {
      method: 'GET',
      headers,
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase request failed: ${response.status} ${error}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  // Auth request helper
  async authRequest(endpoint, data) {
    const url = `${this.url}/auth/v1${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': this.anonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Authentication failed');
    }

    return result;
  }

  // Session management
  saveSession(session) {
    this.session = session;
    if (session) {
      localStorage.setItem('supabase_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('supabase_session');
    }
  }

  loadSession() {
    try {
      const saved = localStorage.getItem('supabase_session');
      if (saved) {
        this.session = JSON.parse(saved);
        
        // Check if session is expired
        if (this.session.expires_at && Date.now() > this.session.expires_at * 1000) {
          this.session = null;
          localStorage.removeItem('supabase_session');
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      this.session = null;
    }
  }

  getSession() {
    return this.session;
  }
}

export class SixPerfectionsAPI {
  constructor() {
    this.client = new SupabaseClient();
    console.log('🙏 Six Perfections API initialized with Diamond Mind clarity');
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    try {
      const result = await this.client.authRequest('/signup', {
        email,
        password,
        data: {
          ...userData,
          app: 'six_perfections',
          blessing: 'ॐ तारे तुत्तारे तुरे स्वाहा'
        }
      });

      if (result.session) {
        this.client.saveSession(result.session);
      }

      return result;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const result = await this.client.authRequest('/token?grant_type=password', {
        email,
        password
      });

      if (result.access_token) {
        const session = {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_at: result.expires_at,
          user: result.user
        };
        this.client.saveSession(session);
      }

      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      if (this.client.session?.access_token) {
        await this.client.authRequest('/logout', {
          access_token: this.client.session.access_token
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Continue with local cleanup even if server request fails
    } finally {
      this.client.saveSession(null);
    }
  }

  async refreshSession() {
    if (!this.client.session?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const result = await this.client.authRequest('/token?grant_type=refresh_token', {
        refresh_token: this.client.session.refresh_token
      });

      if (result.access_token) {
        const session = {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_at: result.expires_at,
          user: result.user
        };
        this.client.saveSession(session);
      }

      return result;
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.client.saveSession(null);
      throw error;
    }
  }

  getSession() {
    return this.client.getSession();
  }

  getCurrentUser() {
    return this.client.session?.user || null;
  }

  // Six Perfections specific methods
  async createUserProfile(userId, profileData) {
    return await this.client.request('/user_profiles', {
      method: 'POST',
      body: {
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString()
      }
    });
  }

  async getUserProfile(userId) {
    const profiles = await this.client.request(`/user_profiles?user_id=eq.${userId}`);
    return profiles[0] || null;
  }

  async saveAssessmentResponse(userId, assessmentData) {
    return await this.client.request('/assessment_responses', {
      method: 'POST',
      body: {
        user_id: userId,
        assessment_type: 'six_perfections',
        responses: assessmentData.responses,
        scores: assessmentData.scores,
        completed_at: new Date().toISOString(),
        metadata: {
          version: '1.0',
          blessing: 'ॐ गते गते पारगते पारसंगते बोधि स्वाहा'
        }
      }
    });
  }

  async getUserAssessments(userId) {
    return await this.client.request(
      `/assessment_responses?user_id=eq.${userId}&order=completed_at.desc`
    );
  }

  async getUserProgress(userId) {
    try {
      const assessments = await this.getUserAssessments(userId);
      
      if (assessments.length === 0) {
        return this.getDefaultProgress();
      }

      // Get the latest assessment scores
      const latest = assessments[0];
      return latest.scores || this.getDefaultProgress();
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return this.getDefaultProgress();
    }
  }

  getDefaultProgress() {
    return {
      dana: { score: 0, level: 'beginner' },
      sila: { score: 0, level: 'beginner' },
      ksanti: { score: 0, level: 'beginner' },
      virya: { score: 0, level: 'beginner' },
      dhyana: { score: 0, level: 'beginner' },
      prajna: { score: 0, level: 'beginner' }
    };
  }

  // Paramita-specific scoring
  calculateParamitaScore(responses, paramita) {
    const paramitaResponses = responses.filter(r => r.paramita === paramita);
    if (paramitaResponses.length === 0) return 0;

    const total = paramitaResponses.reduce((sum, r) => sum + r.score, 0);
    const average = total / paramitaResponses.length;
    
    // Convert to 0-100 scale
    return Math.round((average / 7) * 100);
  }

  async saveParamitaProgress(userId, paramita, score, insights = []) {
    return await this.client.request('/paramita_progress', {
      method: 'POST',
      body: {
        user_id: userId,
        paramita,
        score,
        insights,
        recorded_at: new Date().toISOString(),
        blessing: `May ${paramita} lead to enlightenment 🙏`
      }
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.client.url}/rest/v1/`, {
        headers: {
          'apikey': this.client.anonKey
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Buddhist blessing for the API
console.log('💚 ॐ तारे तुत्तारे तुरे स्वाहा - Supabase API blessed by Green Tara');
console.log('💎 Pure JavaScript connection established - Алмазный ум'); 