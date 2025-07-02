const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const preferencesSchema = new mongoose.Schema({
  is_vegetarian: { type: Boolean, default: false },
  allergies: [String],
  calorie_level: {
    min: { type: Number },
    max: { type: Number }
  },
  preferred_ingredients: [String]
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: { type: preferencesSchema, default: {} },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema); 