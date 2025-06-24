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
    <div className="app">
      <header className="header">
        <h1>🙏 षट्पारमिता</h1>
        <h2>Six Perfections Assessment</h2>
        <p>Pure JSON Architecture - Blessed by Diamond Mind 💎</p>
        
        <div className={`health-status ${healthStatus.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
          <span>API: {healthStatus.status || 'checking...'}</span>
          {healthStatus.json_storage && (
            <span>JSON Storage: {healthStatus.json_storage.status}</span>
          )}
        </div>
      </header>

      <main className="main">
        {user ? (
          <div className="dashboard">
            <div className="user-info">
              <h3>🙏 Welcome, {user.firstName || user.email}!</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Spiritual Level:</strong> {user.spiritualLevel}</p>
              <p><strong>Language:</strong> {user.languagePreference}</p>
              <p><strong>Joined:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p>
              <button onClick={handleSignOut} className="logout-btn">Sign Out 🙏</button>
            </div>
            
            <div className="paramitas-section">
              <h3>Six Perfections Progress (षट्पारमिता):</h3>
              <div className="paramitas-grid">
                {[
                  { id: 'dana', name: 'दान', english: 'Generosity', tibetan: 'སྦྱིན་པ་', color: '#4CAF50' },
                  { id: 'sila', name: 'शील', english: 'Ethics', tibetan: 'ཚུལ་ཁྲིམས་', color: '#2196F3' },
                  { id: 'ksanti', name: 'क्षान्ति', english: 'Patience', tibetan: 'བཟོད་པ་', color: '#FF9800' },
                  { id: 'virya', name: 'वीर्य', english: 'Energy', tibetan: 'བརྩོན་འགྲུས་', color: '#F44336' },
                  { id: 'dhyana', name: 'ध्यान', english: 'Meditation', tibetan: 'བསམ་གཏན་', color: '#9C27B0' },
                  { id: 'prajna', name: 'प्रज्ञा', english: 'Wisdom', tibetan: 'ཤེས་རབ་', color: '#FFD700' }
                ].map(paramita => (
                  <div key={paramita.id} className="paramita-card" style={{ borderLeftColor: paramita.color }}>
                    <h4>{paramita.name}</h4>
                    <h5>{paramita.english}</h5>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{paramita.tibetan}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${user.paramitaProgress?.[paramita.id] || 0}%`,
                          backgroundColor: paramita.color 
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                      {user.paramitaProgress?.[paramita.id] || 0}% Complete
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="action-btn primary">📝 Take Assessment</button>
              <button className="action-btn secondary">📊 View Progress</button>
              <button className="action-btn secondary">🧘‍♀️ Daily Practice</button>
              <button className="action-btn secondary">📚 Study Content</button>
            </div>
          </div>
        ) : (
          <div className="auth-container">
            <div className="auth-forms">
              <div className="auth-form">
                <h3>Continue Your Path</h3>
                <form onSubmit={handleSignIn}>
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
                  <button type="submit">Sign In 🙏</button>
                </form>
              </div>
              
              <div className="auth-form">
                <h3>Begin Your Journey</h3>
                <form onSubmit={handleSignUp}>
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
                  <button type="submit">Register 🌱</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            <p>{message}</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>🙏 ॐ गते गते पारगते पारसंगते बोधि स्वाहा</p>
        <p>May all beings cross to the other shore of enlightenment</p>
      </footer>
    </div>
  );
}

export default App; 