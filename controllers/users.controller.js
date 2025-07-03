const User = require('../models/User');

// Lấy thông tin người dùng theo id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật thông tin người dùng theo id
exports.updateUserById = async (req, res) => {
  try {
    const allowedFields = ['fullName', 'username', 'email','avatarUrl', 'gender', 'preferences', 'isActive'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates, updatedAt: new Date() },
      { new: true, runValidators: true, select: '-passwordHash' }
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật preferences của người dùng
exports.updateUserPreferences = async (req, res) => {
  try {
    const preferences = req.body.preferences;
    if (!preferences) {
      return res.status(400).json({ message: 'Thiếu dữ liệu preferences.' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { preferences, updatedAt: new Date() } },
      { new: true, runValidators: true, select: '-passwordHash' }
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xoá tài khoản người dùng theo id
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({ message: 'Xoá tài khoản thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}; 