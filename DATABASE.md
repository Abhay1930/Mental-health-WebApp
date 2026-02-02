# Database Schema Documentation

## MongoDB Collections

### 1. Users Collection

**Purpose**: Store user account information and streak data

```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase, 3+ chars),
  email: String (unique, lowercase),
  password: String (bcryptjs hashed),
  fullName: String,
  streak: Number (default: 0),
  lastCheckinDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `username` (unique)
- `email` (unique)

**Example**:
```json
{
  "_id": ObjectId("..."),
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "fullName": "John Doe",
  "streak": 5,
  "lastCheckinDate": "2026-02-02T10:30:00Z",
  "createdAt": "2026-01-01T08:00:00Z"
}
```

---

### 2. WellnessEntry Collection

**Purpose**: Store daily wellness check-in data

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: Users),
  mood_today: Number (1-10),
  avg_mood_last_3_days: Number (1-10),
  sleep_hours: Number (0-24),
  sleep_quality: Number (1-5),
  exercise_minutes: Number (0-600),
  stress_level: Number (1-10),
  screen_time: Number (0-24),
  social_interaction_minutes: Number (0-600),
  water_intake_liters: Number (0-10),
  productivity_level: Number (1-10),
  anxiety_level: Number (1-10),
  predicted_mood: String ('happy'|'sad'|'stressed'|'neutral'),
  notes: String (optional),
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `user_id` + `date` (for efficient historical queries)

**Example**:
```json
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "mood_today": 7,
  "avg_mood_last_3_days": 6.7,
  "sleep_hours": 7.5,
  "sleep_quality": 4,
  "exercise_minutes": 45,
  "stress_level": 4,
  "screen_time": 4.2,
  "social_interaction_minutes": 120,
  "water_intake_liters": 2.5,
  "productivity_level": 7,
  "anxiety_level": 3,
  "predicted_mood": "happy",
  "notes": "Had a good day at work",
  "date": "2026-02-02T10:30:00Z",
  "createdAt": "2026-02-02T10:30:00Z"
}
```

---

### 3. ChatHistory Collection

**Purpose**: Store AI conversation history

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: Users),
  messages: [{
    role: String ('user'|'assistant'),
    content: String,
    timestamp: Date
  }],
  mood_context: String ('happy'|'sad'|'stressed'|'neutral'|null),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `user_id` (one chat per user)

**Example**:
```json
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),
  "messages": [
    {
      "role": "user",
      "content": "I'm feeling stressed lately",
      "timestamp": "2026-02-02T15:00:00Z"
    },
    {
      "role": "assistant",
      "content": "I'm sorry to hear that. Let's work through this...",
      "timestamp": "2026-02-02T15:01:00Z"
    }
  ],
  "mood_context": "stressed",
  "createdAt": "2026-02-02T15:00:00Z"
}
```

---

## Query Examples

### Get User's Last 7 Days of Wellness Data

```javascript
db.wellnessEntries.find({
  user_id: ObjectId("user_id"),
  date: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
}).sort({ date: -1 })
```

### Calculate Average Mood for User

```javascript
db.wellnessEntries.aggregate([
  { $match: { user_id: ObjectId("user_id") } },
  { $group: {
    _id: "$user_id",
    avgMood: { $avg: "$mood_today" },
    totalEntries: { $sum: 1 }
  }}
])
```

### Get User's Chat History

```javascript
db.chatHistories.findOne({ user_id: ObjectId("user_id") })
```

### Update Streak

```javascript
db.users.updateOne(
  { _id: ObjectId("user_id") },
  { 
    $inc: { streak: 1 },
    $set: { lastCheckinDate: new Date() }
  }
)
```

---

## Database Migration / Setup

### Initial Setup

```bash
# Connect to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mindtrack"

# Create collections
db.createCollection("users")
db.createCollection("wellnessEntries")
db.createCollection("chatHistories")

# Create indexes
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.wellnessEntries.createIndex({ user_id: 1, date: -1 })
db.chatHistories.createIndex({ user_id: 1 }, { unique: true })
```

### Backup & Restore

MongoDB Atlas handles automatic backups. For manual backup:

```bash
# Backup
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore
mongorestore --uri "mongodb+srv://..." ./backup
```

---

## Data Validation

### User Model Constraints
- Username: 3-50 characters, unique, lowercase
- Email: Valid email format, unique
- Password: Min 6 characters (hashed)
- Fullname: Required, max 100 chars

### WellnessEntry Model Constraints
- mood_today: 1-10 (required)
- sleep_hours: 0-24 (required)
- sleep_quality: 1-5 (required)
- exercise_minutes: 0+ (required)
- stress_level: 1-10 (required)
- screen_time: 0+ (required)
- All numeric fields must be numbers

### ChatHistory Constraints
- user_id: Must exist in users collection
- messages: Array, each message must have role and content
- message.role: Must be 'user' or 'assistant'
- message.content: Required string

---

## Performance Optimization

### Indexes
```javascript
// For fast user lookups
db.users.createIndex({ email: 1 })
db.users.createIndex({ username: 1 })

// For wellness history queries
db.wellnessEntries.createIndex({ user_id: 1 })
db.wellnessEntries.createIndex({ user_id: 1, date: -1 })

// For chat lookup
db.chatHistories.createIndex({ user_id: 1 })
```

### Query Optimization Tips
1. Always filter by `user_id` for user-specific data
2. Use date range queries efficiently
3. Limit returned fields with projection
4. Use pagination for large result sets

---

## Data Retention Policy

- **Users**: Keep indefinitely (or delete after 5 years inactive)
- **Wellness Entries**: Keep for at least 2 years
- **Chat History**: Keep for 1 year or clear on user request

---

Last Updated: February 2, 2026
