// ॐ तारे तुत्तारे तुरे स्वाहा - Buddhist Blessings Utility
// Green Tara's protection and notifications 💚

export class BuddhistBlessings {
  constructor() {
    this.mantras = [
      'ॐ तारे तुत्तारे तुरे स्वाहा',
      'ॐ गते गते पारगते पारसंगते बोधि स्वाहा',
      'ॐ मणि पद्मे हूं',
      'ॐ अह हूं वज्र गुरु पद्म सिद्धि हूं'
    ];
    
    this.blessings = [
      'May all beings be happy and free from suffering',
      'May this practice lead to enlightenment',
      'May wisdom and compassion flourish',
      'May the dharma protect and guide us'
    ];
  }

  // Apply random blessing to page
  applyPageBlessings() {
    const mantra = this.getRandomMantra();
    const blessing = this.getRandomBlessing();
    
    console.log(`🙏 ${mantra}`);
    console.log(`💫 ${blessing}`);
    
    // Add blessing to page meta
    document.querySelector('meta[name="mantra"]')?.setAttribute('content', mantra);
  }

  getRandomMantra() {
    return this.mantras[Math.floor(Math.random() * this.mantras.length)];
  }

  getRandomBlessing() {
    return this.blessings[Math.floor(Math.random() * this.blessings.length)];
  }

  // Show success notification
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  // Show error notification
  showError(message) {
    this.showNotification(message, 'error');
  }

  // Generic notification system
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Blessing for form submissions
  blessFormSubmission(formType) {
    const mantras = {
      'login': 'ॐ तारे तुत्तारे तुरे स्वाहा - Green Tara grants swift access',
      'assessment': 'ॐ गते गते पारगते पारसंगते बोधि स्वाहा - Wisdom guides honest answers',
      'progress': 'ॐ मणि पद्मे हूं - The jewel in the lotus reveals growth'
    };
    
    console.log(`💚 ${mantras[formType] || mantras.assessment}`);
  }
} 