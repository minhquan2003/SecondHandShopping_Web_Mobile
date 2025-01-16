import React, { useState, useEffect } from "react";
import useRegulation from "../../hooks/useRegulation";

const RegulationList = ({ refreshRegulations }) => {
  const {
    regulations,
    loading,
    error,
    deleteRegulation,
    customRegulation,
    searchRegulations,
  } = useRegulation();

  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of regulations per page

  const totalPages = Math.ceil(regulations.length / itemsPerPage);

  useEffect(() => {
    if (refreshRegulations) {
      refreshRegulations();
    }
  }, [regulations]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    searchRegulations(e.target.value);
  };

  const openDeleteModal = (id) => {
    setSelectedRegulation(id);
    setConfirmAction("delete");
    setShowConfirmModal(true);
  };

  const handleCustom = (id, regulation) => {
    setFormData({
      title: regulation.title,
      description: regulation.description,
    });
    setSelectedRegulation(id);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction === "delete") {
      deleteRegulation(selectedRegulation);
    } else if (confirmAction === "save") {
      customRegulation(selectedRegulation, formData);
      setShowModal(false);
    }
    setShowConfirmModal(false);
  };

  const handleSubmit = () => {
    setConfirmAction("save");
    setShowConfirmModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedRegulations = regulations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Our Regulations
      </h2>
      <input
        type="text"
        value={searchKeyword}
        onChange={handleSearchChange}
        placeholder="Search by title"
        className="mb-4 w-full p-2 border rounded"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : regulations.length === 0 ? (
        <div>No active regulations found.</div>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRegulations.map((regulation) => (
                <tr key={regulation._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{regulation.title}</td>
                  <td className="border px-4 py-2">{regulation.description}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleCustom(regulation._id, regulation)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6h10M10 12h10M10 18h10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(regulation._id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 mx-1 border rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-bold mb-4">Edit Regulation</h3>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96 text-center">
            <h3 className="text-xl font-bold mb-4">
              {confirmAction === "delete"
                ? "Are you sure you want to delete this regulation?"
                : "Do you want to save the changes?"}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulationList;
