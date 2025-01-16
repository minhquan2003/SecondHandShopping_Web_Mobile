import React, { useState } from "react";
import useCategory from "../../hooks/useCategory";
import CategoryCustom from "./CategoryCustom";

function CategoryList() {
  const { categories, loading, deleteCategory } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (loading) return <div>Loading...</div>;

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setShowConfirmPopup(false); // Đóng popup sau khi xóa thành công
    } catch (error) {
      setErrorMessage(error.message); // Hiển thị thông báo lỗi nếu không xóa được
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center border p-4 rounded-md bg-white"
          >
            <img
              src={category.image_url}
              alt={category.category_name}
              className="w-16 h-16 rounded mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {category.category_name}
              </h3>
            </div>
            <div>
              <button
                onClick={() => setSelectedCategory(category)}
                className="text-blue-500 hover:underline mr-2"
              >
                Custom
              </button>
              <button
                onClick={() => {
                  setCategoryToDelete(category);
                  setShowConfirmPopup(true); // Hiển thị popup khi nhấn delete
                }}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup xác nhận xóa */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this category?
            </h3>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="mr-4 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(categoryToDelete._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCategory !== null && (
        <CategoryCustom
          selectedCategory={selectedCategory}
          closeForm={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}

export default CategoryList;
