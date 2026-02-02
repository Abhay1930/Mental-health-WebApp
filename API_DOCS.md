# API Documentation

Complete reference for all MindTrack API endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: https://mindtrack-backend.onrender.com/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

Get token from `/auth/login` or `/auth/register`

---

## 🔐 Auth Endpoints

### Register User

**POST** `/auth/register`

**Request**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "6xxx...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

---

### Login User

**POST** `/auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "6xxx...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "streak": 5
  }
}
```

---

### Get User Profile

**GET** `/auth/profile` ✅ Protected

**Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "6xxx...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "streak": 5,
    "createdAt": "2026-02-01T08:00:00Z"
  }
}
```

---

## 📊 Wellness Endpoints

### Add Wellness Entry

**POST** `/wellness` ✅ Protected

**Request**:
```json
{
  "mood_today": 7,
  "sleep_hours": 7.5,
  "sleep_quality": 4,
  "exercise_minutes": 45,
  "stress_level": 4,
  "screen_time": 4.2,
  "social_interaction_minutes": 90,
  "water_intake_liters": 2.5,
  "productivity_level": 7,
  "anxiety_level": 3,
  "notes": "Had a good day"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Wellness entry created successfully",
  "entry": {
    "_id": "6xxx...",
    "user_id": "6xxx...",
    "mood_today": 7,
    "predicted_mood": "happy",
    ...
  },
  "prediction": "happy",
  "streak": 6
}
```

---

### Get Wellness History

**GET** `/wellness/history?days=30` ✅ Protected

**Query Parameters**:
- `days` (optional): Number of days to retrieve (default: 30)

**Response** (200):
```json
{
  "success": true,
  "count": 15,
  "entries": [
    {
      "_id": "6xxx...",
      "mood_today": 7,
      "sleep_hours": 7.5,
      "predicted_mood": "happy",
      "date": "2026-02-02T10:30:00Z",
      ...
    },
    ...
  ]
}
```

---

### Get Wellness Summary

**GET** `/wellness/summary?days=7` ✅ Protected

**Query Parameters**:
- `days` (optional): Number of days for summary (default: 7)

**Response** (200):
```json
{
  "success": true,
  "summary": {
    "averageMood": 7.2,
    "averageSleep": 7.3,
    "totalExercise": 315,
    "averageStress": 4.1,
    "averageAnxiety": 3.2,
    "moodTrend": [
      {
        "date": "2026-01-27T...",
        "mood": 6,
        "predicted": "neutral"
      },
      ...
    ]
  }
}
```

---

## 💬 Chat Endpoints

### Send Message to AI

**POST** `/chat` ✅ Protected

**Request**:
```json
{
  "message": "I'm feeling stressed, what should I do?"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "I understand you're feeling stressed. Here are some techniques...",
  "chatId": "6xxx..."
}
```

---

### Get Chat History

**GET** `/chat/history` ✅ Protected

**Response** (200):
```json
{
  "success": true,
  "messages": [
    {
      "role": "user",
      "content": "I'm feeling stressed",
      "timestamp": "2026-02-02T15:00:00Z"
    },
    {
      "role": "assistant",
      "content": "I understand...",
      "timestamp": "2026-02-02T15:01:00Z"
    }
  ]
}
```

---

### Clear Chat History

**DELETE** `/chat/history` ✅ Protected

**Response** (200):
```json
{
  "success": true,
  "message": "Chat history cleared"
}
```

---

## ✅ Health Check

### Check API Health

**GET** `/health`

**Response** (200):
```json
{
  "status": "OK",
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal error |

---

## Example: Full Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123",
    "fullName": "John Doe"
  }'

# Response includes token

# 2. Add wellness entry
curl -X POST http://localhost:5000/api/wellness \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "mood_today": 7,
    "sleep_hours": 8,
    ...
  }'

# 3. Get summary
curl -X GET "http://localhost:5000/api/wellness/summary?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Chat with AI
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "How can I improve my sleep?"}'
```

---

## Rate Limiting

Currently no rate limiting. Consider adding in production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## CORS

Frontend URL whitelist in production:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
app.use(cors(corsOptions));
```

---

## Testing with Postman

1. Create new collection: "MindTrack API"
2. Add environment variable: `token` = your JWT
3. Set `Authorization` to `Bearer {{token}}`
4. Import examples above

---

## Webhook Support (Future)

Plan to add webhooks for:
- Daily reminders
- Mood alerts
- Community notifications

---

Last Updated: February 2, 2026
