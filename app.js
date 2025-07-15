const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // FE chạy ở port 3000
  credentials: true
}));

app.use(express.json());

// Import routes
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
app.use('/auth', userRoutes);
app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

module.exports = app; 