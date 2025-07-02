const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, gender, avatarUrl, role, preferences, isActive } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
    }
    // Kiểm tra email hoặc username đã tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email hoặc username đã tồn tại.' });
    }
    const user = new User({
      username,
      email,
      passwordHash: password,
      fullName,
      gender,
      avatarUrl,
      role,
      preferences,
      isActive
    });
    await user.save();
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.status(201).json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getAllUsers = (req, res) => {
  res.json({ message: 'API is working!' });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Thiếu username hoặc mật khẩu.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng.' });
    }
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 
