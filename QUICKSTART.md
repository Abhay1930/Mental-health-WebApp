# 🚀 Quick Start Guide

Get MindTrack running in 5 minutes!

## 1. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# ML Model
cd ml-model
pip install -r requirements.txt
cd ..
```

## 2. Setup Environment Variables

### Backend (.env)
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindtrack
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### Frontend (.env)
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 3. Train ML Model

```bash
cd ml-model
python train_model.py
```

Wait for output showing model accuracy (~92-95%)

## 4. Start Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

Wait for: "🚀 Server running on port 5000"

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

Browser opens to: http://localhost:3000

## 5. Test the App

1. **Register**: Create an account
2. **Add Entry**: Fill wellness form
3. **View Prediction**: See tomorrow's mood
4. **Chat**: Talk to AI assistant
5. **Analytics**: View charts

---

## ⚙️ What You Need

- Node.js v16+
- Python 3.8+
- MongoDB (create free Atlas account)
- Google Generative AI key (free)

---

## 🎯 Next Steps

- [ ] Get MongoDB Atlas account
- [ ] Get Gemini API key
- [ ] Run the app locally
- [ ] Deploy to Vercel + Render
- [ ] Update database schema
- [ ] Customize UI colors
- [ ] Add more wellness metrics

---

## 📖 Full Documentation

- [README.md](./README.md) - Complete guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [DATABASE.md](./DATABASE.md) - Database schema details
- [API_DOCS.md](./API_DOCS.md) - API endpoint reference

---

**Happy tracking! 🧠💚**
