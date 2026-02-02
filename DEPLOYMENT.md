# Deployment Guide - MindTrack Mental Health App

## Quick Start Deployment

This guide covers deploying MindTrack to production using Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account with repository
- MongoDB Atlas account (free tier available)
- Google Generative AI API key
- Vercel account
- Render account

---

## Step 1: MongoDB Setup (Atlas)

### Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create new project: "mindtrack"
4. Create cluster (M0 free tier is fine)
5. Wait for cluster creation (5-10 minutes)

### Add Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username: `mindtrack_user`
4. Create strong password (save it!)
5. Give admin role

### Whitelist IPs

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Add your IP
4. For production: Add 0.0.0.0/0 (allows all)

### Get Connection String

1. Click "Connect" on cluster
2. Choose "Connect your application"
3. Copy MongoDB connection string
4. Replace `<username>` and `<password>` with your credentials
5. Save for later

**Format**: `mongodb+srv://username:password@cluster.mongodb.net/mindtrack`

---

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Save for later

---

## Step 3: Push to GitHub

### Initialize Git

```bash
cd /Users/abhay/Desktop/Mindtrack

git init
git add .
git commit -m "Initial commit: Full-stack MindTrack app"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `mindtrack`
3. Set to Public
4. Create repository
5. Copy SSH URL

### Push to GitHub

```bash
git remote add origin <your-github-ssh-url>
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend (Render)

### Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Grant access to your repositories

### Create Web Service

1. Click "New +" → "Web Service"
2. Connect to your GitHub repository
3. Select `mindtrack` repository
4. Fill in details:
   - **Name**: mindtrack-backend
   - **Environment**: Node
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Set Environment Variables

Click "Advanced" and add:

```
MONGODB_URI: mongodb+srv://mindtrack_user:YOUR_PASSWORD@cluster.mongodb.net/mindtrack
JWT_SECRET: your_super_secret_jwt_key_here_at_least_32_characters
GOOGLE_GENERATIVE_AI_KEY: your_gemini_api_key_here
NODE_ENV: production
```

### Deploy

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. You'll get a URL like: `https://mindtrack-backend.onrender.com`
4. **Save this URL** for frontend deployment

---

## Step 5: Deploy Frontend (Vercel)

### Connect Vercel to GitHub

1. Go to [Vercel](https://vercel.com)
2. Sign up / Log in with GitHub
3. Grant GitHub access

### Import Project

1. Click "New Project"
2. Select `mindtrack` repository
3. **Root Directory**: Select `frontend`
4. Click "Continue"

### Environment Variables

Click "Environment Variables" and add:

```
REACT_APP_API_URL: https://mindtrack-backend.onrender.com/api
```

### Deploy

1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. You'll get a URL like: `https://mindtrack.vercel.app`

---

## Step 6: Update Backend with Frontend URL (Optional)

If you want to add frontend URL to CORS whitelist:

1. Go to Render dashboard
2. Select `mindtrack-backend` service
3. Go to "Environment"
4. Add or update:
   ```
   FRONTEND_URL: https://mindtrack.vercel.app
   ```
5. Redeploy the service

---

## Testing Production Deployment

### Test Backend

```bash
curl https://mindtrack-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```

### Test Frontend

Open in browser:
```
https://mindtrack.vercel.app
```

1. Register new account
2. Fill wellness form
3. Check predictions
4. Test AI chat

### Check Logs

- **Backend (Render)**: Click service → "Logs"
- **Frontend (Vercel)**: Click deployment → "Logs"

---

## Common Issues & Solutions

### Backend Connection Error

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check `REACT_APP_API_URL` is set correctly in Vercel
2. Ensure backend service is running (green status on Render)
3. Check CORS is enabled in backend (`src/index.js`)
4. Redeploy frontend

### MongoDB Connection Error

**Problem**: `MongoError: authentication failed`

**Solution**:
1. Check username/password in `MONGODB_URI`
2. Ensure username/password are URL encoded
3. Check IP whitelist in MongoDB Atlas
4. Verify database name is correct

### Missing Environment Variables

**Problem**: `Error: JWT_SECRET is undefined`

**Solution**:
1. Go to Render/Vercel dashboard
2. Check all env vars are set correctly
3. Redeploy the service
4. Check deployment logs

### Token Expired Error

**Problem**: `401 Invalid token` after logging in

**Solution**:
1. This is normal - tokens expire in 7 days
2. User should log out and log back in
3. New token will be issued

---

## Monitoring & Maintenance

### Check Service Health

- **Render**: Dashboard shows "Live" status
- **Vercel**: Deployment shows green checkmark
- **MongoDB**: Check connection in Atlas dashboard

### View Logs

- **Render**: "Logs" tab shows real-time server logs
- **Vercel**: Select deployment → "Logs" tab
- **MongoDB**: "Monitoring" tab for database stats

### Scale Resources (if needed)

- **Render**: Upgrade from Free to Paid plan
- **Vercel**: Handled automatically
- **MongoDB**: Atlas can auto-scale

### Backup Data

MongoDB Atlas automatically backs up:
- Snapshot every 12 hours
- 7-day retention (free tier)
- Restore from dashboard if needed

---

## Updating Code

After making changes locally:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Services auto-deploy on push (if linked to GitHub):
- **Render**: Auto-deploys on main branch push
- **Vercel**: Auto-deploys on main branch push

---

## Domain Setup (Optional)

### Custom Domain on Vercel

1. Go to Vercel project settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records (instructions provided)

### Custom Domain on Render

1. Go to Render service settings
2. Click "Custom Domain"
3. Add domain
4. Update DNS CNAME record

---

## Costs

### Free Tier (Sufficient for MVP)

- **Vercel**: Free forever (unlimited bandwidth)
- **Render**: Free tier (auto-sleeps after 15 min inactivity)
- **MongoDB Atlas**: M0 free cluster (512MB storage)

### Paid Tiers (For Production)

- **Render**: $7/month (always on)
- **MongoDB Atlas**: $57/month (M1 cluster, better performance)

---

## Security Best Practices

1. ✅ Use environment variables (never commit secrets)
2. ✅ Enable HTTPS (automatic on both platforms)
3. ✅ Use strong JWT_SECRET (min 32 chars)
4. ✅ Whitelist only necessary IPs in MongoDB
5. ✅ Use separate MongoDB users for dev/prod
6. ✅ Regenerate API keys periodically
7. ✅ Monitor server logs for errors
8. ✅ Keep dependencies updated

---

## Performance Tips

1. **Database**: Add indexes for frequently queried fields
2. **Frontend**: Code splitting and lazy loading
3. **API**: Cache responses when possible
4. **Images**: Optimize and use CDN
5. **Monitoring**: Set up alerts for errors

---

## Support Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Google Generative AI Docs](https://ai.google.dev/)

---

**Deployment Date**: February 2, 2026
**Status**: Ready for Production
