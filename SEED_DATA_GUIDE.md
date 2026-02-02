# Dashboard Enhancement & Seed Data Guide

## ✅ What's New

### 1. **Dashboard Navigation Updates**
- Added **"📊 Mood History"** button in the dashboard header
- Navigation links to `/mood-history` page for full analytics
- Quick access button in the Mood Insights widget

### 2. **Mood Summary Widget**
A new responsive widget shows last 7 days analytics:
- **Average Mood**: Overall mood average (out of 10)
- **Best Day**: Date and mood score for highest mood
- **Worst Day**: Date and mood score for lowest mood
- **View Full Analytics** button links to detailed MoodHistory page

### 3. **Seed Script for Testing**
Location: `backend/src/scripts/seedWellness.js`

## 🚀 How to Run

### Step 1: Make sure MongoDB is running
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

### Step 2: Ensure backend server is running (optional for seed)
```bash
cd backend
npm install  # if needed
node src/scripts/seedWellness.js
```

### Step 3: Expected Output
```
✅ Connected to MongoDB
✅ Found test user: Test User (test@mindtrack.com)
✅ Successfully inserted 31 wellness entries

📊 Seed Data Summary:
   - User: Test User
   - Entries inserted: 31
   - Date range: Last 30 days
   - Mood range: 4-9 (10-point scale)
   - Sleep range: 6-9 hours

💡 Next steps:
   1. Navigate to http://localhost:3001/dashboard
   2. Click "📊 Mood History" button to view analytics
   3. Check Calendar Heatmap and mood trend charts
```

## 📊 What the Seed Script Creates

- **31 entries** (30 days + today)
- **Realistic variations** based on day of week:
  - Weekdays: More stress, less sleep (6-8 hours), moderate exercise
  - Weekends: Less stress, more sleep (7-9 hours), more exercise
- **Mood range**: 4-9 (10-point scale) for realistic variety
- **Contextual notes**: "Had a great workout", "Stressful deadline", etc.

## 🧪 Testing the Feature

1. **Start the app locally**:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start  # Port 5001

   # Terminal 2: Frontend
   cd frontend
   npm start  # Port 3001
   ```

2. **Login** with test account:
   - Email: `test@mindtrack.com`
   - Password: `Test@123456`

3. **Seed the database**:
   ```bash
   cd backend
   node src/scripts/seedWellness.js
   ```

4. **View Dashboard**:
   - Navigate to http://localhost:3001/dashboard
   - See the "Mood Insights (Last 7 Days)" widget
   - Click "📊 Mood History" to view full analytics page

5. **Explore Analytics**:
   - Calendar heatmap shows mood distribution
   - Line charts show mood/sleep/stress/anxiety trends
   - Date range filters (7 days, 30 days, custom)

## 📁 Modified Files

- `frontend/src/pages/Dashboard.js` - Added mood summary widget + navigation button
- `backend/src/scripts/seedWellness.js` - NEW: Seed script with realistic data

## 🔄 GitHub Status
- Latest commit: `2ae7796` - Dashboard enhancement + seed script
- Branch: `main`
- All changes pushed to remote

## 💡 Next Improvements

Consider adding:
- Weekly mood trend email notifications
- Daily wellness reminders at specific times
- Mood prediction for next 7 days using ML model
- Export analytics as PDF
- Data backup and restore functionality
