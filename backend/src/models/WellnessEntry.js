const mongoose = require('mongoose');

const WellnessEntrySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood_today: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  avg_mood_last_3_days: {
    type: Number,
    default: 0,
  },
  sleep_hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
  },
  sleep_quality: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  exercise_minutes: {
    type: Number,
    required: true,
    min: 0,
  },
  stress_level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  screen_time: {
    type: Number,
    required: true,
    min: 0,
  },
  social_interaction_minutes: {
    type: Number,
    required: true,
    min: 0,
  },
  water_intake_liters: {
    type: Number,
    required: true,
    min: 0,
  },
  productivity_level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  anxiety_level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  predicted_mood: {
    type: String,
    enum: ['happy', 'sad', 'stressed', 'neutral'],
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster queries
WellnessEntrySchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model('WellnessEntry', WellnessEntrySchema);
