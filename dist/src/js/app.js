// ॐ तारे तुत्तारे तुरे स्वाहा - Pure JavaScript App
// Diamond Mind - Алмазный ум freed from bundlers 💎
// Green Tara's protection over pure code 💚

import { SixPerfectionsAPI } from './api/supabase.js';
import { ParamitaAssessment } from './assessment/paramitas.js';
import { BuddhistBlessings } from './utils/blessings.js';

class SixPerfectionsApp {
  constructor() {
    this.api = new SixPerfectionsAPI();
    this.assessment = new ParamitaAssessment();
    this.blessings = new BuddhistBlessings();
    this.currentUser = null;
    
    this.init();
  }

  async init() {
    console.log('🙏 Initializing Six Perfections Assessment...');
    console.log('💚 ॐ तारे तुत्तारे तुरे स्वाहा - Green Tara protects this application');
    
    // Initialize event listeners
    this.setupEventListeners();
    
    // Check for existing session
    await this.checkSession();
    
    // Apply blessings
    this.blessings.applyPageBlessings();
    
    console.log('✨ Application initialized with Diamond Mind clarity');
  }

  setupEventListeners() {
    // Start Assessment button
    const startButton = document.getElementById('start-assessment');
    if (startButton) {
      startButton.addEventListener('click', () => this.startAssessment());
    }

    // Navigation and other interactive elements
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action]')) {
        const action = e.target.dataset.action;
        this.handleAction(action, e.target);
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('.auth-form')) {
        e.preventDefault();
        this.handleAuthSubmission(e.target);
      }
    });
  }

  async checkSession() {
    try {
      const session = await this.api.getSession();
      if (session) {
        this.currentUser = session.user;
        this.showUserDashboard();
      } else {
        this.showWelcomeScreen();
      }
    } catch (error) {
      console.error('Session check failed:', error);
      this.showWelcomeScreen();
    }
  }

  async startAssessment() {
    console.log('🧘 Starting Six Perfections Assessment...');
    
    if (!this.currentUser) {
      // Show login/registration modal
      this.showAuthModal();
      return;
    }

    // Initialize assessment
    try {
      await this.assessment.initialize();
      this.showAssessmentInterface();
    } catch (error) {
      console.error('Failed to start assessment:', error);
      this.showError('Assessment initialization failed. Please try again.');
    }
  }

  showWelcomeScreen() {
    // Already shown by default in HTML
    console.log('💫 Showing welcome screen with Six Perfections');
  }

  showUserDashboard() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <header class="header">
        <h1>🙏 षट्पारमिता Dashboard</h1>
        <p>Welcome back, ${this.currentUser.email}</p>
        <button data-action="logout" class="logout-btn">Logout</button>
      </header>
      
      <main class="dashboard">
        <div class="progress-overview">
          <h2>Your Spiritual Progress</h2>
          <div class="paramitas-progress" id="progress-grid">
            <!-- Progress will be loaded here -->
          </div>
        </div>
        
        <div class="actions">
          <button data-action="take-assessment" class="cta-button">
            Continue Assessment 🧘
          </button>
          <button data-action="view-insights" class="secondary-button">
            View Insights 💎
          </button>
        </div>
      </main>
    `;

    this.loadUserProgress();
  }

  showAuthModal(mode = 'login') {
    // Remove existing modal if any
    const existingModal = document.querySelector('.auth-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" data-action="close-modal">&times;</button>
        <h2>🙏 ${mode === 'login' ? 'Enter the Path' : 'Join the Path'}</h2>
        <p>${mode === 'login' ? 'Welcome back to your spiritual journey' : 'Create an account to begin your Six Perfections journey'}</p>
        
        <form class="auth-form" data-mode="${mode}">
          <input type="email" name="email" placeholder="Email" required>
          <input type="password" name="password" placeholder="Password" required>
          ${mode === 'register' ? '<input type="password" name="confirmPassword" placeholder="Confirm Password" required>' : ''}
          <button type="submit">${mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        
        <p>
          ${mode === 'login' 
            ? 'Don\'t have an account? <a href="#" data-action="show-register">Register here</a>' 
            : 'Already have an account? <a href="#" data-action="show-login">Sign in here</a>'
          }
        </p>
        
        <div class="blessing">
          <p>ॐ गते गते पारगते पारसंगते बोधि स्वाहा</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  async handleAction(action, element) {
    switch (action) {
      case 'logout':
        await this.handleLogout();
        break;
      case 'take-assessment':
        await this.startAssessment();
        break;
      case 'close-modal':
        element.closest('.auth-modal').remove();
        break;
      case 'show-register':
        this.showAuthModal('register');
        break;
      case 'show-login':
        this.showAuthModal('login');
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  async handleAuthSubmission(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const mode = form.dataset.mode;

    try {
      let result;
      
      if (mode === 'register') {
        const confirmPassword = formData.get('confirmPassword');
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        this.blessings.blessFormSubmission('register');
        result = await this.api.signUp(email, password, {
          spiritual_path: 'six_perfections',
          joined_at: new Date().toISOString()
        });
        
        if (result.user) {
          this.blessings.showSuccess('🙏 Welcome to the path! Please check your email to verify your account.');
        }
      } else {
        this.blessings.blessFormSubmission('login');
        result = await this.api.signIn(email, password);
        
        if (result.user) {
          this.currentUser = result.user;
          document.querySelector('.auth-modal').remove();
          this.showUserDashboard();
          this.blessings.showSuccess('🙏 Welcome back to the path of enlightenment!');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      this.blessings.showError(`Authentication failed: ${error.message}`);
    }
  }

  async handleLogout() {
    try {
      await this.api.signOut();
      this.currentUser = null;
      location.reload(); // Simple refresh to reset state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  showAssessmentInterface() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <header class="header">
        <h1>🧘 Six Perfections Assessment</h1>
        <p>Answer honestly to discover your spiritual development</p>
      </header>
      
      <main class="assessment">
        <div class="assessment-container" id="assessment-container">
          <!-- Assessment questions will be loaded here -->
        </div>
      </main>
    `;

    this.assessment.renderQuestions();
  }

  async loadUserProgress() {
    try {
      const progress = await this.api.getUserProgress(this.currentUser.id);
      this.renderProgress(progress);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }

  renderProgress(progress) {
    const container = document.getElementById('progress-grid');
    if (!container) return;

    const paramitas = [
      { name: 'दान (Dana)', key: 'dana', emoji: '🎁' },
      { name: 'शील (Sila)', key: 'sila', emoji: '⚖️' },
      { name: 'क्षान्ति (Ksanti)', key: 'ksanti', emoji: '🕯️' },
      { name: 'वीर्य (Virya)', key: 'virya', emoji: '⚡' },
      { name: 'ध्यान (Dhyana)', key: 'dhyana', emoji: '🧘' },
      { name: 'प्रज्ञा (Prajna)', key: 'prajna', emoji: '💎' }
    ];

    container.innerHTML = paramitas.map(paramita => {
      const score = progress?.[paramita.key]?.score || 0;
      const level = this.getSpiritalLevel(score);
      
      return `
        <div class="progress-card">
          <h3>${paramita.emoji} ${paramita.name}</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${score}%"></div>
          </div>
          <p class="level">${level}</p>
          <p class="score">${score}/100</p>
        </div>
      `;
    }).join('');
  }

  getSpiritalLevel(score) {
    if (score >= 90) return '🌟 Bodhisattva';
    if (score >= 75) return '💫 Advanced Practitioner';
    if (score >= 60) return '🌸 Dedicated Student';
    if (score >= 40) return '🌱 Growing Seeker';
    if (score >= 20) return '🌿 Beginning Path';
    return '🌱 New to Practice';
  }

  showError(message) {
    this.blessings.showError(message);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sixPerfectionsApp = new SixPerfectionsApp();
});

// Buddhist blessing for the application
console.log('💚 ॐ तारे तुत्तारे तुरे स्वाहा - Green Tara blesses this pure JavaScript application');
console.log('💎 Алмазный ум освобожден от сложных бандлеров - Diamond Mind freed from complex bundlers'); 