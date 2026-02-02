const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Valid email required'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 6,
    select: false,
  },
  fullName: {
    type: String,
    required: [true, 'Full name required'],
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastCheckinDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password);
};

module.exports = mongoose.model('User', UserSchema);
