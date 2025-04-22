import { useState, useEffect } from "react";
import axios from "axios";

function useCategory(page = 1, fieldSort = "", orderSort = "", searchKey = "") {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = `http://localhost:5555/admin/categories?page=${page}`;

        if (fieldSort && orderSort) {
          url += `&sort=${orderSort}&sort=${fieldSort}`;
        }
        if (searchKey) {
          url += `&filter=category_name&filter=${searchKey}`;
        }
        const response = await axios.get(url);

        const data = await response.data;
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
          setTotalPages(data.totalPages || 1);
        } else throw new Error("Invalide response structure");
      } catch (err) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, fieldSort, orderSort, searchKey]);

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

  return {
    categories,
    loading,
    error,
    totalPages,
    createCategory,
    editCategory,
    deleteCategory,
  };
}

export default useCategory;
