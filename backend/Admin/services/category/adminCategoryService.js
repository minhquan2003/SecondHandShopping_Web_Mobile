import Categories from "../../../User/models/Categories.js";
import Products from "../../../User/models/Products.js";

// Lấy tất cả categories có phân trang và tổng số
export const getAllCategories = async () => {
  try {
    const categories = await Categories.find().sort({ createdAt: -1 });
    const totalCategories = await Categories.countDocuments();
    return {
      categories,
      totalCategories,
    };
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

// Thêm mới category
export const addCategory = async (data) => {
  try {
    const category = new Categories(data);
    return await category.save();
  } catch (error) {
    throw new Error("Error adding category: " + error.message);
  }
};

// Sửa category theo ID
export const updateCategory = async (id, data) => {
  try {
    return await Categories.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

// Xóa category theo ID
export const deleteCategory = async (id) => {
  try {
    // Kiểm tra xem có sản phẩm nào đang sử dụng category này không
    const productsUsingCategory = await Products.find({ category_id: id });

    if (productsUsingCategory.length > 0) {
      throw new Error(
        "Cannot delete category because it is used by some products."
      );
    }

    // Nếu không có sản phẩm nào, tiến hành xóa category
    return await Categories.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const category = await Categories.findById(categoryId).select("name");
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw new Error("Error fetching category: " + error.message);
  }
};
