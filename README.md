# 🧠 MindTrack - Mental Health Wellness Web App

A full-stack MERN application for tracking daily wellness metrics, predicting mood using ML, and providing AI-powered mental health support via Gemini API.

## 📋 Features

✅ **User Authentication** - JWT-based secure login/registration
✅ **Daily Wellness Tracking** - Track 11 wellness metrics daily
✅ **ML Mood Prediction** - Random Forest model predicts tomorrow's mood
✅ **AI Chatbot** - Gemini-powered mental health support chatbot
✅ **Analytics Dashboard** - Visual charts and mood trends
✅ **Streak Tracking** - Daily check-in streaks for motivation
✅ **Chat History** - Persistent AI conversation history
✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 🏗️ Project Structure

```
mindtrack/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── models/         # MongoDB schemas (User, WellnessEntry, ChatHistory)
│   │   ├── routes/         # API routes (auth, wellness, chat)
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # JWT auth middleware
│   │   └── config/         # Database config
│   ├── server.js           # Express server entry point
│   ├── package.json
│   ├── vercel.json         # Vercel deployment config
│   └── Procfile            # Render deployment config
│
├── frontend/               # React + Tailwind CSS
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard, Analytics, Chat
│   │   ├── components/    # Reusable components (Charts, etc.)
│   │   ├── services/      # API service layer
│   │   ├── App.js         # Main app with routing
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── ml-model/              # Python ML model
│   ├── data/
│   │   └── wellness_data.csv  # Training dataset
│   ├── models/            # Trained model files
│   ├── train_model.py     # Model training script
│   ├── predict.py         # Prediction inference script
│   └── requirements.txt    # Python dependencies
│
└── README.md              # This file
```

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **AI Integration**: Google Generative AI (Gemini)

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router v6
- **HTTP Client**: Axios

### ML Model
- **Language**: Python
- **Libraries**: scikit-learn, pandas, numpy
- **Model**: Random Forest Classifier
- **Dataset**: 50+ wellness entries with 12 features

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or Atlas)
- Google Generative AI API key

### Step 1: Clone & Install Dependencies

```bash
# Clone or navigate to project
cd mindtrack

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install ML model dependencies
cd ml-model
pip install -r requirements.txt
cd ..
```

### Step 2: Environment Setup

#### Backend (.env)
Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindtrack
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key_here
NODE_ENV=development
```

#### Frontend (.env)
Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Train ML Model

```bash
cd ml-model
python train_model.py
```

**Output**:
- `models/mood_predictor.pkl` - Trained Random Forest model
- `models/label_encoder.pkl` - Label encoder for predictions
- `models/mood_predictor.json` - Model metadata

### Step 4: Start Development Servers

**Option A: Separate terminals**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Option B: Concurrent (requires concurrently package)**

```bash
npm install concurrently
npm run dev
```

Backend runs on: `http://localhost:5000`
Frontend runs on: `http://localhost:3000`

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### Option 1: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 2: GitHub Integration
1. Push to GitHub
2. Connect repository to Vercel dashboard
3. Auto-deploys on push

#### Environment Variables (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Render)

#### Option 1: Via Render Dashboard
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`

#### Option 2: Using Render.yaml

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: mindtrack-backend
    runtime: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: MONGODB_URI
        value: your_mongodb_uri
      - key: JWT_SECRET
        value: your_jwt_secret
      - key: GOOGLE_GENERATIVE_AI_KEY
        value: your_gemini_key
```

```bash
render deploy
```

### Environment Variables (Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mindtrack
JWT_SECRET=your_super_secret_key
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
NODE_ENV=production
```

### MongoDB Setup (Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and cluster
3. Add IP whitelist (0.0.0.0/0 for development, specific IPs for production)
4. Create database user
5. Copy connection string
6. Replace in `.env` and deployment settings

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to environment variables

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Wellness Tracking
- `POST /api/wellness` - Add wellness entry (Protected)
- `GET /api/wellness/history?days=30` - Get wellness history (Protected)
- `GET /api/wellness/summary?days=7` - Get summary stats (Protected)

### AI Chat
- `POST /api/chat` - Send message to AI (Protected)
- `GET /api/chat/history` - Get chat history (Protected)
- `DELETE /api/chat/history` - Clear chat history (Protected)

## 🤖 ML Model Details

### Features (11 inputs)
- `mood_today` (1-10)
- `avg_mood_last_3_days` (1-10)
- `sleep_hours` (0-12)
- `sleep_quality` (1-5)
- `exercise_minutes` (0-300)
- `stress_level` (1-10)
- `screen_time` (0-12 hours)
- `social_interaction_minutes` (0-300)
- `water_intake_liters` (0-5)
- `productivity_level` (1-10)
- `anxiety_level` (1-10)

### Output Classes
- `happy` 😊
- `sad` 😢
- `stressed` 😰
- `neutral` 😐

### Model Performance
- Algorithm: Random Forest Classifier (100 estimators)
- Training Accuracy: ~95%
- Test Accuracy: ~92%
- Feature Importance: Stress level, anxiety, and mood are top predictors

## 📱 User Dashboard Features

### Daily Wellness Form
- Mood slider (1-10)
- Sleep tracking
- Exercise minutes
- Stress & anxiety levels
- Screen time tracking
- Social interaction minutes
- Water intake
- Productivity level
- Optional notes

### Predictions
- Next day mood prediction
- Confidence score
- Probability distribution

### Analytics
- Mood trend chart (7, 14, 30 days)
- Health metrics visualization
- Streak counter
- Summary statistics
- Recent entries table

### AI Support Chat
- Personalized suggestions based on mood
- Wellness recommendations
- Mental health support
- Persistent conversation history

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected API routes with middleware
- ✅ CORS enabled
- ✅ MongoDB indexes for performance
- ✅ Environment variables for secrets

## 📈 Sample Wellness Data

The project includes a dataset with 50 wellness records used to train the ML model. Each record contains:
- All 11 input features
- Actual next-day mood label (happy/sad/stressed/neutral)

Train a custom model:
```bash
cd ml-model
python train_model.py
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB Error: authentication failed
```
**Solution**: Check connection string in `.env`. Ensure:
- Username/password are URL encoded
- Whitelist your IP in MongoDB Atlas
- Database name exists

### JWT Token Error
```
401 Invalid token
```
**Solution**: 
- Ensure `JWT_SECRET` is set in `.env`
- Token may be expired (7 day expiry)
- Re-login to get new token

### Gemini API Error
```
Failed to get AI response
```
**Solution**:
- Verify API key in `.env`
- Check API key has Generative AI enabled
- Monitor API usage/quota

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Backend CORS already enabled
- Check frontend `REACT_APP_API_URL` points to correct backend URL

## 🎯 Development Workflow

1. **Frontend Development**
   - Run `npm start` in frontend folder
   - Components in `src/components/`
   - Pages in `src/pages/`
   - Styles with Tailwind CSS

2. **Backend Development**
   - Run `npm run dev` in backend folder
   - Add routes in `src/routes/`
   - Add logic in `src/controllers/`
   - Test with Postman/Thunder Client

3. **ML Model Updates**
   - Modify `train_model.py`
   - Add features in `data/wellness_data.csv`
   - Run `python train_model.py`
   - Commit new model files

## 📝 Future Enhancements

- [ ] Two-factor authentication
- [ ] Social sharing features
- [ ] Reminder notifications
- [ ] Integration with fitness trackers
- [ ] Advanced analytics (correlation analysis)
- [ ] Mood journal with NLP analysis
- [ ] Mobile app (React Native)
- [ ] Video consultation with therapists
- [ ] Prescription medication tracking
- [ ] Sleep pattern analysis

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 👨‍💻 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues, questions, or suggestions:
1. Open GitHub Issue
2. Email: support@mindtrack.local
3. Discord: Join our community

---

**Made with ❤️ for mental health awareness**

Last Updated: February 2, 2026
# Mental-health-WebApp
