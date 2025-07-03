const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
}, { _id: false });

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const preferencesSchema = new mongoose.Schema({
  is_vegetarian: { type: Boolean, default: false },
  calorie_level: {
    min: { type: Number },
    max: { type: Number }
  },
  allergens: [String],
  suitable_ingredients: [String]
}, { _id: false });

const ratingSchema = new mongoose.Schema({
  average: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ingredients: [ingredientSchema],
  steps: [String],
  tags: [String],
  preferences: { type: preferencesSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  rating: { type: ratingSchema, default: () => ({}) },
  comments: [commentSchema],
  isPublic: { type: Boolean, default: true }
});

module.exports = mongoose.model('Recipe', recipeSchema); 