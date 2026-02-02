const WellnessEntry = require('../models/WellnessEntry');
const User = require('../models/User');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Helper function to call ML prediction API
const getPrediction = async (features) => {
  try {
    // For now, we'll use a placeholder - replace with actual ML model endpoint
    const modelPath = path.join(__dirname, '../../ml-model/models/mood_predictor.json');
    
    if (fs.existsSync(modelPath)) {
      const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      // Simple prediction logic - this would be replaced with actual ML inference
      return predictMood(features, model);
    }
    
    return 'neutral'; // Default prediction if model not available
  } catch (error) {
    console.error('Prediction error:', error);
    return 'neutral';
  }
};

const predictMood = (features, model) => {
  // Simplified prediction logic - replace with actual model inference
  const stressLevel = features.stress_level;
  const anxietyLevel = features.anxiety_level;
  const moodToday = features.mood_today;
  
  if (stressLevel >= 7 || anxietyLevel >= 7) return 'stressed';
  if (moodToday >= 7) return 'happy';
  if (moodToday <= 3) return 'sad';
  return 'neutral';
};

exports.addWellnessEntry = async (req, res) => {
  try {
    const {
      mood_today,
      sleep_hours,
      sleep_quality,
      exercise_minutes,
      stress_level,
      screen_time,
      social_interaction_minutes,
      water_intake_liters,
      productivity_level,
      anxiety_level,
      notes
    } = req.body;

    // Validation
    if (!mood_today || mood_today < 1 || mood_today > 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mood_today value (1-10)'
      });
    }

    // Calculate avg mood of last 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const lastThreeDays = await WellnessEntry.find({
      user_id: req.userId,
      date: { $gte: threeDaysAgo }
    });

    const avgMood = lastThreeDays.length > 0
      ? lastThreeDays.reduce((sum, entry) => sum + entry.mood_today, 0) / lastThreeDays.length
      : mood_today;

    // Prepare features for prediction
    const features = {
      mood_today,
      avg_mood_last_3_days: avgMood,
      sleep_hours,
      sleep_quality,
      exercise_minutes,
      stress_level,
      screen_time,
      social_interaction_minutes,
      water_intake_liters,
      productivity_level,
      anxiety_level
    };

    // Get prediction
    const predicted_mood = await getPrediction(features);

    // Create entry
    const entry = new WellnessEntry({
      user_id: req.userId,
      mood_today,
      avg_mood_last_3_days: avgMood,
      sleep_hours,
      sleep_quality,
      exercise_minutes,
      stress_level,
      screen_time,
      social_interaction_minutes,
      water_intake_liters,
      productivity_level,
      anxiety_level,
      predicted_mood,
      notes
    });

    await entry.save();

    // Update user streak
    const today = new Date().toDateString();
    const user = await User.findById(req.userId);
    
    if (user.lastCheckinDate) {
      const lastCheckin = new Date(user.lastCheckinDate).toDateString();
      if (lastCheckin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastCheckin === yesterday.toDateString()) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
      }
    } else {
      user.streak = 1;
    }

    user.lastCheckinDate = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Wellness entry created successfully',
      entry,
      prediction: predicted_mood,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWellnessHistory = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const entries = await WellnessEntry.find({
      user_id: req.userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWellnessSummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const entries = await WellnessEntry.find({
      user_id: req.userId,
      date: { $gte: startDate }
    });

    if (entries.length === 0) {
      return res.json({
        success: true,
        summary: {
          averageMood: 0,
          averageSleep: 0,
          totalExercise: 0,
          averageStress: 0,
          moodTrend: []
        }
      });
    }

    const summary = {
      averageMood: entries.reduce((sum, e) => sum + e.mood_today, 0) / entries.length,
      averageSleep: entries.reduce((sum, e) => sum + e.sleep_hours, 0) / entries.length,
      totalExercise: entries.reduce((sum, e) => sum + e.exercise_minutes, 0),
      averageStress: entries.reduce((sum, e) => sum + e.stress_level, 0) / entries.length,
      averageAnxiety: entries.reduce((sum, e) => sum + e.anxiety_level, 0) / entries.length,
      moodTrend: entries.reverse().map(e => ({
        date: e.date,
        mood: e.mood_today,
        predicted: e.predicted_mood
      }))
    };

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
