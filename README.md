# षट्पारमिता Six Perfections Assessment

> ॐ मणि पद्मे हूँ - **Pure Diamond JSON Architecture** 💎
> 
> Blessed by Mahakala's Diamond Clarity and Green Tara's Swift Action

A comprehensive Buddhist assessment application that measures and develops the six perfections (paramitas) through scientifically validated assessments and spiritual practices.

## 🙏 Six Perfections (षट्पारमिता)

| Paramita | Sanskrit | Tibetan | English | Meaning |
|----------|----------|---------|---------|---------|
| 1 | दान (Dana) | སྦྱིན་པ་ | Generosity | Selfless giving and sharing |
| 2 | शील (Sila) | ཚུལ་ཁྲིམས་ | Ethics | Moral conduct and integrity |
| 3 | क्षान्ति (Ksanti) | བཟོད་པ་ | Patience | Tolerance and forbearance |
| 4 | वीर्य (Virya) | བརྩོན་འགྲུས་ | Energy | Enthusiastic effort |
| 5 | ध्यान (Dhyana) | བསམ་གཏན་ | Meditation | Mental cultivation and focus |
| 6 | प्रज्ञा (Prajna) | ཤེས་རབ་ | Wisdom | Transcendent understanding |

## 🏗️ Pure JSON Architecture

**Revolutionary Diamond-Clear Design:**
- ✨ **Pure JSON Storage** - No external databases required
- 💎 **Local File System** - Complete data sovereignty
- 🔐 **JWT Authentication** - Secure token-based auth
- 🚀 **Zero Dependencies** - Minimal, clean architecture
- 📦 **Portable** - Runs anywhere with Node.js

## 🌟 Features

- **42-Question Assessment** (7 per paramita)
- **Real-time Progress Tracking**
- **Multilingual Support** (English, Russian, Hindi, Tibetan)
- **Daily Practice Logging**
- **Meditation Content**
- **Scientific Scoring Algorithms**
- **Buddhist Wisdom Integration**

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (blessed by digital dharma 🌐)
- **npm** or **yarn**

### Pure JSON Setup 💎

1. **Clone and enter the path of enlightenment**:
```bash
git clone <repository-url>
cd "Six Perfections Assessment"
```

2. **Install dependencies (pure and minimal)**:
```bash
npm install
```

3. **Create data directories (blessed by Green Tara)**:
```bash
mkdir -p data/users data/assessments data/progress data/backups data/content
```

4. **Configure environment**:
```bash
cp env.example .env
# Edit .env with your preferred settings
```

5. **Start the development environment**:
```bash
# Start API Gateway (port 3000)
cd backend/api-gateway
npm start

# Start Auth Service (port 8001)
cd backend/auth-service
python app.py

# Start Frontend (port 3001)
cd frontend/web-dashboard
npm run dev
```

6. **Open your browser to**:
- Frontend: http://localhost:3001
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:8001

## 📂 Project Structure

```
Six Perfections Assessment/
├── 💎 data/                      # Pure JSON Data Storage
│   ├── users/                    # User profiles
│   ├── assessments/             # Assessment results
│   ├── progress/                # Daily practice tracking
│   ├── content/                 # Meditation content
│   └── backups/                 # Automatic backups
├── 🌐 backend/
│   ├── api-gateway/             # Main API (Node.js/Express)
│   ├── auth-service/            # Authentication (Python/FastAPI)
│   ├── assessment-engine/       # Assessment logic
│   ├── content-management/      # Meditation content
│   ├── analytics-service/       # Progress analytics
│   ├── notification-service/    # Practice reminders
│   └── user-management/         # User operations
├── 🎨 frontend/
│   ├── web-dashboard/           # React dashboard
│   ├── android/                 # React Native (Android)
│   └── ios/                     # React Native (iOS)
├── 📄 database/
│   └── json-schema.json         # Pure JSON schema definition
├── 🔧 netlify/
│   └── functions/               # Serverless functions
└── 📚 docs/                     # Documentation
```

## 🧘‍♂️ Usage

### Taking an Assessment

1. **Register/Login** with your email
2. **Select Language** (en/ru/hi/bo)
3. **Complete 42 Questions** (7 per paramita)
4. **Receive Personalized Results**
5. **Begin Practice Recommendations**

### Daily Practice

1. **Log Daily Activities** for each paramita
2. **Track Meditation Sessions**
3. **Record Insights and Reflections**
4. **Monitor Progress Over Time**

## 🔐 Authentication

Pure JWT-based authentication with local JSON storage:

```javascript
// Registration
POST /api/auth/register
{
  "email": "practitioner@dharma.org",
  "password": "secure_password",
  "firstName": "Dharma",
  "lastName": "Practitioner"
}

// Login
POST /api/auth/login
{
  "email": "practitioner@dharma.org", 
  "password": "secure_password"
}
```

## 📊 Data Storage

All data stored in secure JSON files:

- **Users**: `data/users/{userId}.json`
- **Assessments**: `data/assessments/{assessmentId}.json`
- **Progress**: `data/progress/{userId}/{date}.json`
- **Content**: `data/content/{contentId}.json`

## 🌍 Deployment

### Netlify (Recommended)
```bash
# Deploy entire application
netlify deploy --prod

# Functions auto-deploy with main site
```

### Docker
```bash
# Build and run entire stack
docker-compose up --build
```

### Manual Server
```bash
# Production build
npm run build

# Start production server
NODE_ENV=production npm start
```

## 🧪 Testing

```bash
# Test API Gateway
cd backend/api-gateway
npm test

# Test Auth Service
cd backend/auth-service
python -m pytest

# Test Frontend
cd frontend/web-dashboard  
npm test
```

## 📈 Monitoring

Health check endpoints:
- API Gateway: `GET /health`
- Auth Service: `GET /health`
- Functions: `GET /.netlify/functions/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the Buddhist principles of Right Action
4. Test thoroughly with compassion
5. Submit a pull request with loving-kindness

## 📜 License

MIT License - May this code benefit all sentient beings

## 🙏 Buddhist Blessing

> ॐ गते गते पारगते पारसंगते बोधि स्वाहा
> 
> "Gone, gone, gone beyond, gone completely beyond, enlightenment, so be it!"
> 
> May all beings achieve enlightenment through the Six Perfections

---

**🛡️ Protected by Mahakala's Diamond Clarity**  
**💚 Blessed by Green Tara's Swift Action**  
**📿 Guided by Avalokiteshvara's Compassion**

*This application bridges ancient Buddhist wisdom with modern technology for the spiritual development of all beings.* 