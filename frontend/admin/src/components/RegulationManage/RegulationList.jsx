// import React, { useState, useEffect } from "react";
// import useRegulation from "../../hooks/useRegulation";

// const RegulationList = ({ refreshRegulations }) => {
//   const {
//     regulations,
//     loading,
//     error,
//     deleteRegulation,
//     customRegulation,
//     searchRegulations,
//   } = useRegulation();

//   const [selectedRegulation, setSelectedRegulation] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//   });
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10; // Number of regulations per page

//   const totalPages = Math.ceil(regulations.length / itemsPerPage);

//   useEffect(() => {
//     if (refreshRegulations) {
//       refreshRegulations();
//     }
//   }, [regulations]);

//   const handleSearchChange = (e) => {
//     setSearchKeyword(e.target.value);
//     searchRegulations(e.target.value);
//   };

//   const openDeleteModal = (id) => {
//     setSelectedRegulation(id);
//     setConfirmAction("delete");
//     setShowConfirmModal(true);
//   };

//   const handleCustom = (id, regulation) => {
//     setFormData({
//       title: regulation.title,
//       description: regulation.description,
//     });
//     setSelectedRegulation(id);
//     setShowModal(true);
//   };

//   const handleConfirm = () => {
//     if (confirmAction === "delete") {
//       deleteRegulation(selectedRegulation);
//     } else if (confirmAction === "save") {
//       customRegulation(selectedRegulation, formData);
//       setShowModal(false);
//     }
//     setShowConfirmModal(false);
//   };

//   const handleSubmit = () => {
//     setConfirmAction("save");
//     setShowConfirmModal(true);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const displayedRegulations = regulations.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-4 bg-white rounded-lg">
//       <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
//         Our Regulations
//       </h2>
//       <input
//         type="text"
//         value={searchKeyword}
//         onChange={handleSearchChange}
//         placeholder="Search by title"
//         className="text-sm mb-4 w-full p-2 border rounded"
//       />
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div>{error}</div>
//       ) : regulations.length === 0 ? (
//         <div>No active regulations found.</div>
//       ) : (
//         <>
//           <table className="w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="text-sm border px-4 py-2 text-center">Title</th>
//                 <th className="text-sm border px-4 py-2 text-center">
//                   Description
//                 </th>
//                 <th className="text-sm border px-4 py-2 text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayedRegulations.map((regulation) => (
//                 <tr key={regulation._id} className="hover:bg-gray-50">
//                   <td className="text-sm border px-4 py-2">
//                     {regulation.title}
//                   </td>
//                   <td className="text-sm border px-4 py-2">
//                     {regulation.description}
//                   </td>
//                   <td className="text-sm border px-4 py-2 text-center">
//                     <button
//                       onClick={() => handleCustom(regulation._id, regulation)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M10 6h10M10 12h10M10 18h10"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => openDeleteModal(regulation._id)}
//                       className="text-red-600 hover:text-red-800 ml-2"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-4">
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => handlePageChange(index + 1)}
//                   className={`px-3 py-1 mx-1 border rounded ${
//                     currentPage === index + 1
//                       ? "bg-blue-600 text-white"
//                       : "bg-white text-blue-600"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md w-96">
//             <h3 className="text-xl font-bold mb-4">Edit Regulation</h3>
//             <label className="block mb-2">Title</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               className="w-full p-2 border rounded mb-4"
//             />
//             <label className="block mb-2">Description</label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className="w-full p-2 border rounded mb-4"
//             ></textarea>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md w-96 text-center">
//             <h3 className="text-xl font-bold mb-4">
//               {confirmAction === "delete"
//                 ? "Are you sure you want to delete this regulation?"
//                 : "Do you want to save the changes?"}
//             </h3>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleConfirm}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegulationList;

import { useState } from "react";
import useRegulation from "../../hooks/useRegulation";
import { TbListDetails } from "react-icons/tb";
import { FaSort, FaSearch, FaPen } from "react-icons/fa";
import EditRegulationModal from "./CustomRegulation";

const RegulationList = () => {
  const [page, setPage] = useState(1);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const [editingRegulation, setEditingRegulation] = useState(null);

  const {
    regulations = [],
    loading,
    error,
    totalPages,
    deleteRegulation,
    customRegulation,
  } = useRegulation(page, fieldSort, orderSort, searchKey);

  const handleSaveEdit = async (id, updatedData) => {
    await customRegulation(id, updatedData);
    setEditingRegulation(null); // Đóng popup sau khi lưu
  };

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one regulation.");
      return;
    }
    if (
      window.confirm("Are you sure you want to delete selected regulations?")
    ) {
      deleteRegulation(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (regulationId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(regulationId)
        ? prev.filter((id) => id != regulationId)
        : [...prev, regulationId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(regulations.map((regulation) => regulation._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  const handleViewDetails = (regulation) => {
    setSelectedRegulation(regulation);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRegulation(null);
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
            if (e.target.value == "deleteRegulations") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteRegulations">Delete selected regulations</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by title..."
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
                  checked={
                    regulations.length > 0 &&
                    selectedCheckBox.length === regulations.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Title <FaSort onClick={() => handleSort("title")} />
                </span>
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Description{" "}
                  <FaSort onClick={() => handleSort("description")} />
                </span>
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Detail
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Custom
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(regulations) && regulations.length > 0 ? (
              regulations.map((regulation) => (
                <tr key={regulation._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(regulation._id)}
                      onChange={() => handleSelectOne(regulation._id)}
                    />
                  </td>

                  <td className="border px-2 py-2 text-sm ">
                    {regulation.title}
                  </td>
                  <td className="border px-2 py-2 text-sm ">
                    {regulation.description}
                  </td>

                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(regulation)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => setEditingRegulation(regulation)}
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <FaPen />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No regulations available.
                  {console.log(regulations)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedRegulation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    Regulation
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedRegulation.title}
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    Content
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedRegulation.description}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRegulation && (
        <EditRegulationModal
          regulation={editingRegulation}
          onClose={() => setEditingRegulation(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default RegulationList;
