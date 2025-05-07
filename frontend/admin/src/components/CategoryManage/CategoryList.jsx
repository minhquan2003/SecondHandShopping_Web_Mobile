// import React, { useState } from "react";
// import useCategory from "../../hooks/useCategory";
// import CategoryCustom from "./CategoryCustom";

// function CategoryList() {
//   const { categories, loading, deleteCategory } = useCategory();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showConfirmPopup, setShowConfirmPopup] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);

//   if (loading) return <div>Loading...</div>;

//   const handleDelete = async (categoryId) => {
//     try {
//       await deleteCategory(categoryId);
//       setShowConfirmPopup(false); // Đóng popup sau khi xóa thành công
//     } catch (error) {
//       setErrorMessage(error.message); // Hiển thị thông báo lỗi nếu không xóa được
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {categories.map((category) => (
//           <div
//             key={category._id}
//             className="flex items-center border p-4 rounded-md bg-white"
//           >
//             <img
//               src={category.image_url}
//               alt={category.category_name}
//               className="w-16 h-16 rounded mr-4"
//             />
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold">
//                 {category.category_name}
//               </h3>
//             </div>
//             <div>
//               <button
//                 onClick={() => setSelectedCategory(category)}
//                 className="text-blue-500 hover:underline mr-2"
//               >
//                 Custom
//               </button>
//               <button
//                 onClick={() => {
//                   setCategoryToDelete(category);
//                   setShowConfirmPopup(true); // Hiển thị popup khi nhấn delete
//                 }}
//                 className="text-red-500 hover:underline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Popup xác nhận xóa */}
//       {showConfirmPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-md shadow-md w-96">
//             <h3 className="text-lg font-semibold mb-4">
//               Are you sure you want to delete this category?
//             </h3>
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowConfirmPopup(false)}
//                 className="mr-4 text-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(categoryToDelete._id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedCategory !== null && (
//         <CategoryCustom
//           selectedCategory={selectedCategory}
//           closeForm={() => setSelectedCategory(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default CategoryList;

import { useState } from "react";
import useCategory from "../../hooks/useCategory";
import { TbListDetails } from "react-icons/tb";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const CategoryList = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const {
    categories = [],
    loading,
    error,
    totalPages,
    deleteCategory,
  } = useCategory(page, fieldSort, orderSort, searchKey);
  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected products?")) {
      deleteCategory(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (categoryId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id != categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(categories.map((category) => category._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value == "deleteCategories") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteCategories">Delete selected categories</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by username..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    categories.length > 0 &&
                    selectedCheckBox.length === categories.length
                  }
                />
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Image
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Name <FaSort onClick={() => handleSort("category_name")} />
                </span>
              </th>
              <th className="text-sm px-2 py-2 text-center font-boldborder">
                Custom
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(category._id)}
                      onChange={() => handleSelectOne(category._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <img
                      src={category.image_url}
                      alt={category.category_name}
                      className="w-16 h-16 rounded mr-4"
                    />
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {category.category_name}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                      <TbListDetails />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
