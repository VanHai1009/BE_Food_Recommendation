const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

exports.register = async (req, res) => {
  try {
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
    const { username, email, password, fullName, gender, role, preferences, isActive } = data;

    let avatarUrl = null;
    if (req.file) {
      // Upload lên Cloudinary
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('Cloudinary upload result:', result);
                resolve(result.secure_url);
              }
            }
          );
          stream.end(buffer);
        });
      };
      avatarUrl = await streamUpload(req.file.buffer);
    }

    const user = new User({
      username,
      email,
      passwordHash: password,
      fullName,
      gender,
      avatarUrl, // Lưu URL
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
    // Tạo JWT token
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.json({ user: userObj, token });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res) => {
  try {
    // req.user sẽ được gán bởi middleware xác thực (ví dụ: JWT)
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực.' });
    }
    // Lấy thông tin user từ DB (ẩn passwordHash)
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng xuất (với JWT, chỉ cần client xóa token)
exports.logout = (req, res) => {
  // Nếu muốn, có thể xử lý blacklist token ở đây
  res.json({ message: 'Đăng xuất thành công. Hãy xóa token ở phía client.' });
}; 
