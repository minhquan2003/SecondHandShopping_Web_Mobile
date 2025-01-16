import React, { useState } from "react";
import CategoryList from "../components/CategoryManage/CategoryList";
import CategoryCustom from "../components/CategoryManage/CategoryCustom";

const CategoryManage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const openCategoryForm = (category = null) => {
    setSelectedCategory(category);
    setShowCategoryForm(true);
  };

  const closeCategoryForm = () => {
    setSelectedCategory(null);
    setShowCategoryForm(false);
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 pl-4">Category List</h2>
      {/* Button to open the Category Custom Form for creating a new category */}
      <div className="mt-4 pl-4">
        <button
          onClick={() => openCategoryForm()}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Category
        </button>
      </div>
      {/* Category Custom Form */}
      <div className="mb-6">
        {showCategoryForm && (
          <CategoryCustom
            selectedCategory={selectedCategory}
            closeForm={closeCategoryForm}
          />
        )}
      </div>

      {/* Category List */}
      <div>
        <CategoryList openCategoryForm={openCategoryForm} />
      </div>
    </div>
  );
};

export default CategoryManage;
