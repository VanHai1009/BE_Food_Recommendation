const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

// Middleware xác thực (giả định sẽ tạo ở middlewares/auth.js)
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Route GET đơn giản
// router.get('/', userController.getAllUsers);

// Route đăng ký tài khoản
router.post('/register', upload.single('avatar'), authController.register);

// Route đăng nhập tài khoản
router.post('/login', authController.login);

// Route lấy thông tin người dùng hiện tại
router.get('/me', authMiddleware, authController.getMe);

// Route đăng xuất
router.post('/logout', authController.logout);

// Route lấy thông tin người dùng theo id
router.get('/:id', usersController.getUserById);

// Route cập nhật thông tin người dùng theo id
router.patch('/:id', usersController.updateUserById);

// Route cập nhật preferences của người dùng
router.patch('/:id/preferences', usersController.updateUserPreferences);

// Route lấy danh sách tất cả người dùng
router.get('/', usersController.getAllUsers);

// Route xoá tài khoản người dùng
router.delete('/:id', usersController.deleteUserById);

module.exports = router;

// exports.getAllUsers = (req, res) => {
//   res.json({ message: 'API is working!' });
// };