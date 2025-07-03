const express = require('express');
const app = express();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/user.routes');
const recipeRoutes = require('./routes/recipe.routes');
app.use('/auth', userRoutes);
app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

module.exports = app; 