import { useState, useEffect } from "react";
import axios from "axios";

function useCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/categories"
        );
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const createCategory = async (newCategory) => {
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/category/",
        newCategory
      );
      if (response.data.success) {
        // Cập nhật ngay lập tức mà không cần load lại trang
        setCategories((prevCategories) => [
          ...prevCategories,
          response.data.data,
        ]);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const editCategory = async (id, updatedCategory) => {
    try {
      const response = await axios.put(
        `http://localhost:5555/admin/category/${id}`,
        updatedCategory
      );
      if (response.data.success) {
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === id ? response.data.data : cat
          )
        );
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      // Gửi request đến backend để xóa category
      const response = await axios.delete(
        `http://localhost:5555/admin/category/${id}`
      );

      // Kiểm tra nếu xóa thành công, cập nhật lại danh sách categories
      if (response.data.success) {
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat._id !== id)
        );
      } else {
        alert(response.data.message); // Hiển thị thông báo lỗi từ backend
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  return { categories, loading, createCategory, editCategory, deleteCategory };
}

export default useCategory;
