import React, { useState } from "react";
import useFeedback from "../../hooks/useFeedback";
import { FiFilter } from "react-icons/fi";

const FeedbackList = () => {
  const { feedbackList, feedbackTotal, loading } = useFeedback();
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showMenu, setShowMenu] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Items per page

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!feedbackList.length) {
    return <div>No feedbacks available.</div>;
  }

  const toggleExpand = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const truncateMessage = (message) => {
    const maxLength = 100;
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setShowMenu(false);
  };

  const sortedFeedbackList = [...feedbackList].sort((a, b) => {
    if (sortBy === "username") {
      const nameA = (a.username || "Anonymous").toLowerCase();
      const nameB = (b.username || "Anonymous").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Paginate the sorted feedback list
  const paginatedFeedbackList = sortedFeedbackList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(feedbackTotal / pageSize);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Feedback List ({feedbackTotal})
      </h2>

      {/* Icon lọc */}
      <div className="relative flex justify-end mb-4">
        <button
          className="p-2 border rounded-md bg-gray-100"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="text-orange-500 bg-orange-100">
            <FiFilter />
          </span>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute right-0 mt-10 bg-white shadow-md rounded-md w-48">
            <button
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleSortChange("username", "asc")}
            >
              A → Z
            </button>
            <button
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleSortChange("username", "desc")}
            >
              Z → A
            </button>
            <button
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleSortChange("createdAt", "asc")}
            >
              Earliest
            </button>
            <button
              className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleSortChange("createdAt", "desc")}
            >
              Latest
            </button>
          </div>
        )}
      </div>

      <table className="table-fixed w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 border px-4 py-2">Username</th>
            <th className="w-1/2 border px-4 py-2">Message</th>
            <th className="w-1/4 border px-4 py-2">Received At</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFeedbackList.map((feedback) => {
            const isLongMessage = feedback.message.length > 100;
            return (
              <tr key={feedback._id} className="hover:bg-gray-50 bg-white">
                <td className="text-sm border px-4 py-2">
                  {feedback.name || "Anonymous"}
                </td>
                <td className="text-sm border px-4 py-2">
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedFeedback === feedback._id
                        ? "max-h-full"
                        : "max-h-[40px]"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {expandedFeedback === feedback._id
                      ? feedback.message
                      : truncateMessage(feedback.message)}
                  </div>
                  {isLongMessage && (
                    <button
                      onClick={() => toggleExpand(feedback._id)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      {expandedFeedback === feedback._id
                        ? "Show less"
                        : "Show more"}
                    </button>
                  )}
                </td>
                <td className="text-sm border px-4 py-2">
                  {new Date(feedback.createdAt).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      {feedbackTotal > pageSize && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <div className="flex items-center">
            <span className="mr-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
