const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

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
    let updates = {};
    // Nếu gửi qua form-data với key data
    if (req.body.data) {
      const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      for (const key of allowedFields) {
        if (data[key] !== undefined) {
          updates[key] = data[key];
        }
      }
    } else {
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }
    }
    // Nếu có file avatar mới, upload lên Cloudinary
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(buffer);
        });
      };
      const avatarUrl = await streamUpload(req.file.buffer);
      updates.avatarUrl = avatarUrl;
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
   
    res.json({ total: users.length, users });
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