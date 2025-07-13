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

// Lấy chi tiết một công thức theo id
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết công thức', error: err.message });
  }
};

// Xoá một công thức theo id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức.' });
    }
    // Chỉ cho phép tác giả hoặc admin xoá
    if (recipe.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xoá công thức này.' });
    }
    await Recipe.findByIdAndDelete(id);
    res.json({ message: 'Xoá công thức thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xoá công thức', error: err.message });
  }
};

// Hàm loại bỏ dấu, ký tự đặc biệt và khoảng trắng, chuyển về thường
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

// Tìm kiếm công thức theo tag và/hoặc nguyên liệu
exports.searchRecipes = async (req, res) => {
  try {
    let { tag, ingredient, title } = req.query;
    const query = {};

    let hasTag = tag && (Array.isArray(tag) ? tag.length > 0 : !!tag);
    let hasIngredient = ingredient && (Array.isArray(ingredient) ? ingredient.length > 0 : !!ingredient);
    let hasTitle = !!title;

    // Nếu không có tag/ingredient/title, query như bình thường
    if (!hasTag && !hasIngredient && !hasTitle) {
      const recipes = await Recipe.find({});
      return res.json({ total: recipes.length, recipes });
    }

    // Nếu có bất kỳ tag/ingredient/title, lấy hết recipes rồi filter ở backend
    let recipes = await Recipe.find({});

    // Chuẩn hóa về mảng
    if (tag && !Array.isArray(tag)) tag = [tag];
    if (ingredient && !Array.isArray(ingredient)) ingredient = [ingredient];

    recipes = recipes.filter(recipe => {
      // Filter ingredient
      let ingredientOk = true;
      if (hasIngredient) {
        ingredientOk = ingredient.every(ing =>
          recipe.ingredients.some(i =>
            removeVietnameseTones(i.name.trim()).includes(removeVietnameseTones(ing.trim()))
          )
        );
      }
      // Filter tag
      let tagOk = true;
      if (hasTag) {
        tagOk = tag.every(tg =>
          recipe.tags.some(t =>
            removeVietnameseTones(t.trim()).includes(removeVietnameseTones(tg.trim()))
          )
        );
      }
      // Filter title
      let titleOk = true;
      if (hasTitle) {
        titleOk = removeVietnameseTones(recipe.title).includes(removeVietnameseTones(title));
      }
      return ingredientOk && tagOk && titleOk;
    });

    res.json({ total: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm công thức', error: err.message });
  }
};

