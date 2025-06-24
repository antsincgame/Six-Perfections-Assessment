// ॐ मणि पद्मे हूँ - Six Perfections Pure JSON Frontend
// Blessed by Green Tara for swift action 💚

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState({});
  const [authForm, setAuthForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  // API Base URL for JSON backend (Netlify Functions)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const NETLIFY_FUNCTIONS = '/.netlify/functions';

  useEffect(() => {
    checkAuthStatus();
    checkHealth();
  }, []);

  // Check if user is authenticated via localStorage token
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('six_perfections_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}${NETLIFY_FUNCTIONS}/auth?action=me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        localStorage.removeItem('six_perfections_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('six_perfections_token');
    }
    
    setLoading(false);
  };

  // Check system health status
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}${NETLIFY_FUNCTIONS}/health`);
      const health = await response.json();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ status: 'error', message: 'Unable to connect to server' });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}${NETLIFY_FUNCTIONS}/auth?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('six_perfections_token', result.token);
        setUser(result.user);
        setMessage('🙏 Login successful! Welcome to the Six Perfections journey.');
      } else {
        setMessage(`Login failed: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}${NETLIFY_FUNCTIONS}/auth?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          spiritualLevel: 'beginner',
          languagePreference: 'en'
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('six_perfections_token', result.token);
        setUser(result.user);
        setMessage('🎉 Registration successful! Your spiritual journey begins now.');
      } else {
        setMessage(`Registration failed: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('six_perfections_token');
      
      if (token) {
        await fetch(`${API_BASE}${NETLIFY_FUNCTIONS}/auth?action=logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      localStorage.removeItem('six_perfections_token');
      setUser(null);
      setMessage('🙏 Logged out successfully. May your practice continue.');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('six_perfections_token');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>🙏 Loading Six Perfections Assessment...</h2>
        <p>ॐ मणि पद्मे हूँ</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>षट्पारमिता Six Perfections Assessment</h1>
        <p>Pure JSON Architecture - Blessed by Diamond Mind 💎</p>
        
        <div className="health-status">
          <h3>System Status:</h3>
          {healthStatus.status && (
            <span>API: {healthStatus.status}</span>
          )}
          {healthStatus.json_storage && (
            <span> | JSON Storage: {healthStatus.json_storage.status}</span>
          )}
        </div>

        {user ? (
          <div className="user-dashboard">
            <h2>Welcome, {user.firstName || user.email}! 🙏</h2>
            <div className="user-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Spiritual Level:</strong> {user.spiritualLevel}</p>
              <p><strong>Language:</strong> {user.languagePreference}</p>
              <p><strong>Joined:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
            
            <div className="paramitas-progress">
              <h3>Six Perfections Progress (षट्पारमिता):</h3>
              <div className="paramitas-grid">
                {[
                  { id: 'dana', name: 'दान', english: 'Generosity', color: '#4CAF50' },
                  { id: 'sila', name: 'शील', english: 'Ethics', color: '#2196F3' },
                  { id: 'ksanti', name: 'क्षान्ति', english: 'Patience', color: '#FF9800' },
                  { id: 'virya', name: 'वीर्य', english: 'Energy', color: '#F44336' },
                  { id: 'dhyana', name: 'ध्यान', english: 'Meditation', color: '#9C27B0' },
                  { id: 'prajna', name: 'प्रज्ञा', english: 'Wisdom', color: '#FFD700' }
                ].map(paramita => (
                  <div key={paramita.id} className="paramita-card" style={{ borderColor: paramita.color }}>
                    <h4>{paramita.name}</h4>
                    <p>{paramita.english}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${user.paramitaProgress?.[paramita.id] || 0}%`,
                          backgroundColor: paramita.color 
                        }}
                      ></div>
                    </div>
                    <span>{user.paramitaProgress?.[paramita.id] || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="actions">
              <button className="take-assessment">Take Assessment</button>
              <button className="view-progress">View Progress</button>
              <button className="meditation-practice">Daily Practice</button>
              <button onClick={handleSignOut} className="sign-out">Sign Out</button>
            </div>
          </div>
        ) : (
          <div className="auth-container">
            <h2>{isSignUp ? 'Begin Your Journey' : 'Continue Your Path'}</h2>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
              {isSignUp && (
                <>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={authForm.firstName}
                    onChange={(e) => setAuthForm({ ...authForm, firstName: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={authForm.lastName}
                    onChange={(e) => setAuthForm({ ...authForm, lastName: e.target.value })}
                    required
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
              <button type="submit">
                {isSignUp ? '🌱 Begin Journey' : '🙏 Continue Path'}
              </button>
            </form>
            
            <p>
              {isSignUp ? 'Already on the path?' : 'New to the Six Perfections?'}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="link-button"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </header>

      <footer className="App-footer">
        <div className="buddhist-wisdom">
          <p>ॐ मणि पद्मे हूँ | སྤྱན་རས་གཟིགས་ | Avalokiteshvara</p>
          <p>"May all beings achieve enlightenment through the Six Perfections"</p>
        </div>
        <div className="tech-stack">
          <p>Powered by Pure JSON 📄 | Diamond Clear Architecture 💎</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 