const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Tạo mới công thức (chỉ user đã đăng nhập)
router.post('/', authMiddleware, upload.single('image'), recipesController.createRecipe);

// Cập nhật công thức (chỉ user là tác giả mới được sửa)
router.patch('/:id', authMiddleware, upload.single('image'), recipesController.updateRecipe);

// Lấy danh sách tất cả công thức (không cần đăng nhập)
router.get('/', recipesController.getAllRecipes);

// Lấy recipes public của user bất kỳ
router.get('/user/:userId', recipesController.getRecipesByUser);

// Lấy tất cả recipes của user đang đăng nhập
router.get('/myRecipes', authMiddleware, recipesController.getMyRecipes);

module.exports = router; 