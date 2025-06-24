// ॐ गते गते पारगते पारसंगते बोधि स्वाहा - Six Perfections Assessment
// Pure JavaScript assessment system - Diamond Mind clarity 💎

export class ParamitaAssessment {
  constructor() {
    this.questions = {
      dana: [
        {
          id: 'dana_1',
          text: 'I regularly give to charity or help others without expecting anything in return',
          sanskrit: 'दान - निष्काम दान देना'
        },
        {
          id: 'dana_2', 
          text: 'I share my time and resources generously with family and friends',
          sanskrit: 'दान - समय और संसाधन साझा करना'
        },
        {
          id: 'dana_3',
          text: 'I feel joy when giving to others, even when I have little',
          sanskrit: 'दान - देने में आनंद अनुभव करना'
        }
      ],
      sila: [
        {
          id: 'sila_1',
          text: 'I always try to speak truthfully and avoid harmful speech',
          sanskrit: 'शील - सत्य भाषण और अहिंसक वाणी'
        },
        {
          id: 'sila_2',
          text: 'I respect all living beings and avoid causing harm',
          sanskrit: 'शील - सभी जीवों का सम्मान'
        },
        {
          id: 'sila_3',
          text: 'I follow moral principles even when no one is watching',
          sanskrit: 'शील - निरीक्षण के बिना भी नैतिकता'
        }
      ],
      ksanti: [
        {
          id: 'ksanti_1',
          text: 'I remain calm and patient even in difficult situations',
          sanskrit: 'क्षान्ति - कठिन परिस्थितियों में धैर्य'
        },
        {
          id: 'ksanti_2',
          text: 'I can forgive others easily, even when they hurt me',
          sanskrit: 'क्षान्ति - दूसरों को क्षमा करना'
        },
        {
          id: 'ksanti_3',
          text: 'I accept change and uncertainty with equanimity',
          sanskrit: 'क्षान्ति - परिवर्तन को स्वीकार करना'
        }
      ],
      virya: [
        {
          id: 'virya_1',
          text: 'I maintain consistent effort in my spiritual practice',
          sanskrit: 'वीर्य - आध्यात्मिक अभ्यास में दृढ़ता'
        },
        {
          id: 'virya_2',
          text: 'I persevere through challenges without giving up',
          sanskrit: 'वीर्य - चुनौतियों में दृढ़ता'
        },
        {
          id: 'virya_3',
          text: 'I approach my goals with enthusiasm and dedication',
          sanskrit: 'वीर्य - उत्साह और समर्पण'
        }
      ],
      dhyana: [
        {
          id: 'dhyana_1',
          text: 'I practice meditation or mindfulness regularly',
          sanskrit: 'ध्यान - नियमित ध्यान अभ्यास'
        },
        {
          id: 'dhyana_2',
          text: 'I can focus my mind and avoid distractions easily',
          sanskrit: 'ध्यान - मन की एकाग्रता'
        },
        {
          id: 'dhyana_3',
          text: 'I experience moments of deep peace and clarity',
          sanskrit: 'ध्यान - गहरी शांति का अनुभव'
        }
      ],
      prajna: [
        {
          id: 'prajna_1',
          text: 'I understand the interconnected nature of all things',
          sanskrit: 'प्रज्ञा - सब कुछ का परस्पर संबंध'
        },
        {
          id: 'prajna_2',
          text: 'I can see beyond surface appearances to deeper truths',
          sanskrit: 'प्रज्ञा - गहरे सत्य की अंतर्दृष्टि'
        },
        {
          id: 'prajna_3',
          text: 'I recognize the impermanent nature of all experiences',
          sanskrit: 'प्रज्ञा - अनित्यता की समझ'
        }
      ]
    };

    this.currentQuestion = 0;
    this.responses = [];
    this.totalQuestions = 0;
    this.allQuestions = [];
  }

  async initialize() {
    // Flatten all questions
    this.allQuestions = [];
    Object.keys(this.questions).forEach(paramita => {
      this.questions[paramita].forEach(question => {
        this.allQuestions.push({
          ...question,
          paramita: paramita
        });
      });
    });
    
    this.totalQuestions = this.allQuestions.length;
    this.currentQuestion = 0;
    this.responses = [];
    
    console.log(`🧘 Assessment initialized with ${this.totalQuestions} questions`);
  }

  renderQuestions() {
    const container = document.getElementById('assessment-container');
    if (!container) return;

    container.innerHTML = `
      <div class="assessment-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(this.currentQuestion / this.totalQuestions) * 100}%"></div>
        </div>
        <p class="progress-text">Question ${this.currentQuestion + 1} of ${this.totalQuestions}</p>
      </div>
      
      <div class="question-card">
        ${this.renderCurrentQuestion()}
      </div>
    `;
  }

  renderCurrentQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      return this.renderResults();
    }

    const question = this.allQuestions[this.currentQuestion];
    const paramitaName = this.getParamitaDisplayName(question.paramita);

    return `
      <div class="question-content">
        <div class="paramita-badge">${paramitaName}</div>
        <h3 class="question-text">${question.text}</h3>
        <p class="sanskrit-text">${question.sanskrit}</p>
        
        <div class="response-scale">
          <p class="scale-label">How much do you agree with this statement?</p>
          <div class="scale-options">
            ${this.renderScaleOptions(question.id)}
          </div>
        </div>
        
        <div class="question-actions">
          ${this.currentQuestion > 0 ? '<button class="prev-btn" onclick="window.sixPerfectionsApp.assessment.previousQuestion()">Previous</button>' : ''}
          <button class="next-btn" onclick="window.sixPerfectionsApp.assessment.nextQuestion()" disabled id="next-button">Next</button>
        </div>
      </div>
    `;
  }

  renderScaleOptions(questionId) {
    const options = [
      { value: 1, label: 'Strongly Disagree' },
      { value: 2, label: 'Disagree' },
      { value: 3, label: 'Somewhat Disagree' },
      { value: 4, label: 'Neutral' },
      { value: 5, label: 'Somewhat Agree' },
      { value: 6, label: 'Agree' },
      { value: 7, label: 'Strongly Agree' }
    ];

    return options.map(option => `
      <label class="scale-option">
        <input type="radio" name="${questionId}" value="${option.value}" 
               onchange="window.sixPerfectionsApp.assessment.selectAnswer(${option.value})">
        <span class="option-label">${option.value}</span>
        <span class="option-text">${option.label}</span>
      </label>
    `).join('');
  }

  selectAnswer(value) {
    const question = this.allQuestions[this.currentQuestion];
    
    // Store response
    this.responses[this.currentQuestion] = {
      questionId: question.id,
      paramita: question.paramita,
      score: value,
      timestamp: new Date().toISOString()
    };

    // Enable next button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
      nextButton.disabled = false;
    }
  }

  nextQuestion() {
    if (this.responses[this.currentQuestion]) {
      this.currentQuestion++;
      this.renderQuestions();
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.renderQuestions();
    }
  }

  renderResults() {
    const scores = this.calculateScores();
    
    return `
      <div class="results-container">
        <h2>🙏 Your Six Perfections Assessment Results</h2>
        <p class="results-blessing">ॐ गते गते पारगते पारसंगते बोधि स्वाहा</p>
        
        <div class="scores-grid">
          ${Object.keys(scores).map(paramita => {
            const score = scores[paramita];
            const level = this.getSpiritalLevel(score);
            const name = this.getParamitaDisplayName(paramita);
            
            return `
              <div class="score-card">
                <h3>${name}</h3>
                <div class="score-circle">
                  <span class="score-number">${score}</span>
                </div>
                <p class="score-level">${level}</p>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${score}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="results-actions">
          <button class="cta-button" onclick="window.sixPerfectionsApp.assessment.saveResults()">
            Save Results 💾
          </button>
          <button class="secondary-button" onclick="window.sixPerfectionsApp.assessment.retakeAssessment()">
            Retake Assessment 🔄
          </button>
        </div>
      </div>
    `;
  }

  calculateScores() {
    const scores = {};
    const paramitas = ['dana', 'sila', 'ksanti', 'virya', 'dhyana', 'prajna'];
    
    paramitas.forEach(paramita => {
      const paramitaResponses = this.responses.filter(r => r.paramita === paramita);
      if (paramitaResponses.length > 0) {
        const total = paramitaResponses.reduce((sum, r) => sum + r.score, 0);
        const average = total / paramitaResponses.length;
        scores[paramita] = Math.round((average / 7) * 100);
      } else {
        scores[paramita] = 0;
      }
    });
    
    return scores;
  }

  getSpiritalLevel(score) {
    if (score >= 90) return '🌟 Bodhisattva Level';
    if (score >= 75) return '💫 Advanced Practitioner';
    if (score >= 60) return '🌸 Dedicated Student';
    if (score >= 40) return '🌱 Growing Seeker';
    if (score >= 20) return '🌿 Beginning Path';
    return '🌱 New to Practice';
  }

  getParamitaDisplayName(paramita) {
    const names = {
      dana: '🎁 दान (Dana) - Generosity',
      sila: '⚖️ शील (Sila) - Ethics', 
      ksanti: '🕯️ क्षान्ति (Ksanti) - Patience',
      virya: '⚡ वीर्य (Virya) - Energy',
      dhyana: '🧘 ध्यान (Dhyana) - Meditation',
      prajna: '💎 प्रज्ञा (Prajna) - Wisdom'
    };
    return names[paramita] || paramita;
  }

  async saveResults() {
    try {
      const scores = this.calculateScores();
      const user = window.sixPerfectionsApp.currentUser;
      
      if (!user) {
        throw new Error('No user logged in');
      }

      await window.sixPerfectionsApp.api.saveAssessmentResponse(user.id, {
        responses: this.responses,
        scores: scores
      });

      window.sixPerfectionsApp.blessings.showSuccess('🙏 Results saved! Your spiritual journey continues...');
      
      // Return to dashboard
      setTimeout(() => {
        window.sixPerfectionsApp.showUserDashboard();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to save results:', error);
      window.sixPerfectionsApp.blessings.showError('Failed to save results. Please try again.');
    }
  }

  retakeAssessment() {
    this.initialize();
    this.renderQuestions();
  }
}

// Buddhist blessing for the assessment
console.log('🧘 ॐ गते गते पारगते पारसंगते बोधि स्वाहा - Assessment module blessed'); 