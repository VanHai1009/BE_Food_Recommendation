const Recipe = require('../models/Recipe');
const cloudinary = require('../config/cloudinary');

// Tạo mới công thức
exports.createRecipe = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      // Upload lên Cloudinary
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
      imageUrl = await streamUpload(req.file.buffer);
    }
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
    const recipeData = { ...data, authorId: req.user._id };
    if (imageUrl) recipeData.imageUrl = imageUrl;
    const recipe = new Recipe(recipeData);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi tạo công thức', error: err.message });
  }
};

// Cập nhật công thức
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse data nếu gửi qua form-data (key: data)
    let updateData = req.body;
    if (req.body.data) {
      updateData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
    }

    // Nếu có file ảnh mới, upload lên Cloudinary
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
      const imageUrl = await streamUpload(req.file.buffer);
      updateData.imageUrl = imageUrl;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật công thức', error: err.message });
  }
};

// Lấy danh sách tất cả công thức
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ total: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách công thức', error: err.message });
  }
};

// Lấy recipes public của user bất kỳ
exports.getRecipesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipes = await Recipe.find({ authorId: userId, isPublic: true });
    res.json({ total: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy công thức của user', error: err.message });
  }
};

// Lấy tất cả recipes của user đang đăng nhập
exports.getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipes = await Recipe.find({ authorId: userId });
    res.json({ total: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy công thức của bạn', error: err.message });
  }
};

