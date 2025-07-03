const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');
const authMiddleware = require('../middlewares/auth');

// Tạo mới công thức (chỉ user đã đăng nhập)
router.post('/', authMiddleware, recipesController.createRecipe);

// Cập nhật công thức (chỉ user là tác giả mới được sửa)
router.patch('/:id', authMiddleware, recipesController.updateRecipe);

module.exports = router; 