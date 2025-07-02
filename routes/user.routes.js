const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Route GET đơn giản
router.get('/', userController.getAllUsers);

// Route đăng ký tài khoản
router.post('/register', userController.register);

// Route đăng nhập tài khoản
router.post('/login', userController.login);

module.exports = router;

exports.getAllUsers = (req, res) => {
  res.json({ message: 'API is working!' });
};