import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category/adminCategoryService.js";

// Lấy tất cả categories có phân trang và tổng số
export const getCategories = async (req, res) => {
  try {
    const categoryData = await getAllCategories();
    res.status(200).json({
      success: true,
      totalCategories: categoryData.totalCategories,
      data: categoryData.categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm mới category
export const createCategory = async (req, res) => {
  try {
    const newCategory = await addCategory(req.body);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật category theo ID
export const editCategory = async (req, res) => {
  try {
    const updatedCategory = await updateCategory(req.params.id, req.body);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa category theo ID
export const removeCategory = async (req, res) => {
  try {
    const deletedCategory = await deleteCategory(req.params.id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
