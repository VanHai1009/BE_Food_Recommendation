const Recipe = require('../models/Recipe');

// Tạo mới công thức
exports.createRecipe = async (req, res) => {
  try {
    // Gán authorId từ thông tin user đã đăng nhập
    const recipeData = { ...req.body, authorId: req.user._id };
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
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      req.body,
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

