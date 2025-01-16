import React, { useState } from "react";
import usePartners from "../../hooks/usePartner";
import { TbListDetails } from "react-icons/tb";
import { GiCancel } from "react-icons/gi";

const PartnerList = () => {
  const { partners, loading, error, deletePartner } = usePartners();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 10;

  const openModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const handleDelete = async (partnerId) => {
    await deletePartner(partnerId);
    window.location.reload();
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(partners.length / partnersPerPage);

  // Slice the partners array to display only the current page's data
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = partners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
      {/* Display Partner List */}
      <table className="table-auto w-full border-collapse border border-white mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentPartners.map((partner) => (
            <tr key={partner._id} className="hover:bg-gray-50 bg-white">
              <td className="text-sm border px-4 py-2">
                {partner.name || "N/A"}
              </td>
              <td className="text-sm border px-4 py-2">
                {partner.email || "N/A"}
              </td>
              <td className="text-sm border px-4 py-2">
                {partner.phone || "N/A"}
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center space-x-2">
                  <button
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(partner._id)}
                  >
                    <GiCancel />
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => openModal(partner)}
                  >
                    <TbListDetails />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for displaying partner details */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Partner Details</h2>
            <div>
              <p>
                <strong>Name:</strong> {selectedPartner.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedPartner.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPartner.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedPartner.address}
              </p>
              <p>
                <strong>Role:</strong> {selectedPartner.role}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedPartner.status ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerList;
