/**
 * Seed Script: Generate 30 days of realistic wellness data for testing
 * Usage: node src/scripts/seedWellness.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const WellnessEntry = require('../models/WellnessEntry');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindtrack';

// Function to generate realistic wellness data
function generateWellnessData(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  
  // Realistic variations for different times of week
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  return {
    mood_today: Math.floor(Math.random() * 5) + 4, // 4-9
    sleep_hours: isWeekend ? Math.floor(Math.random() * 3) + 7 : Math.floor(Math.random() * 3) + 6, // 6-9
    sleep_quality: Math.floor(Math.random() * 4) + 2, // 2-5
    exercise_minutes: isWeekend ? Math.floor(Math.random() * 90) + 30 : Math.floor(Math.random() * 60) + 20, // 20-120
    stress_level: isWeekend ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 5) + 3, // 2-8
    screen_time: Math.floor(Math.random() * 4) + 4, // 4-8 hours
    social_interaction_minutes: Math.floor(Math.random() * 120) + 30, // 30-150 min
    water_intake_liters: Math.floor(Math.random() * 3) + 1.5, // 1.5-4.5L
    productivity_level: Math.floor(Math.random() * 5) + 4, // 4-9
    anxiety_level: Math.floor(Math.random() * 5) + 2, // 2-7
    date: date.toISOString(),
    notes: generateNote(dayOfWeek, isWeekend)
  };
}

// Generate contextual notes
function generateNote(dayOfWeek, isWeekend) {
  const notes = [
    'Good day, had a productive meeting',
    'Feeling stressed with deadlines',
    'Great workout, feeling energized',
    'Relaxing weekend with friends',
    'Busy work day but managed well',
    'Feeling a bit tired, need more sleep',
    'Had a nice walk in the park',
    'Struggled with focus today',
    'Great meditation session',
    'Social gathering, lots of fun'
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find test user (assuming email: test@mindtrack.com)
    let testUser = await User.findOne({ email: 'test@mindtrack.com' });
    
    if (!testUser) {
      console.error('❌ Test user not found. Please create a user with email: test@mindtrack.com');
      process.exit(1);
    }

    console.log(`✅ Found test user: ${testUser.fullName} (${testUser.email})`);
    
    // Clear existing entries for this user (optional)
    // await WellnessEntry.deleteMany({ userId: testUser._id });
    // console.log('✅ Cleared existing entries for test user');

    // Generate and insert 30 days of wellness data
    const wellnessEntries = [];
    for (let i = 30; i >= 0; i--) {
      const entry = {
        userId: testUser._id,
        ...generateWellnessData(i)
      };
      wellnessEntries.push(entry);
    }

    const insertedEntries = await WellnessEntry.insertMany(wellnessEntries);
    console.log(`✅ Successfully inserted ${insertedEntries.length} wellness entries`);

    // Display summary
    console.log('\n📊 Seed Data Summary:');
    console.log(`   - User: ${testUser.fullName}`);
    console.log(`   - Entries inserted: ${insertedEntries.length}`);
    console.log(`   - Date range: Last 30 days`);
    console.log(`   - Mood range: 4-9 (10-point scale)`);
    console.log(`   - Sleep range: 6-9 hours`);
    console.log('\n💡 Next steps:');
    console.log('   1. Navigate to http://localhost:3001/dashboard');
    console.log('   2. Click "📊 Mood History" button to view analytics');
    console.log('   3. Check Calendar Heatmap and mood trend charts');

    await mongoose.connection.close();
    console.log('\n✅ Connection closed. Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed script error:', error.message);
    process.exit(1);
  }
}

// Run seed script
seedDatabase();
