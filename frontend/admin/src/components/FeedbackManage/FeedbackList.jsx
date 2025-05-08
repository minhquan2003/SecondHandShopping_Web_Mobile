// import React, { useState } from "react";
// import useFeedback from "../../hooks/useFeedback";
// import { FiFilter } from "react-icons/fi";

// const FeedbackList = () => {
//   const { feedbackList, feedbackTotal, loading } = useFeedback();
//   const [expandedFeedback, setExpandedFeedback] = useState(null);
//   const [sortBy, setSortBy] = useState("username");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [showMenu, setShowMenu] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10; // Items per page

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!feedbackList.length) {
//     return <div>No feedbacks available.</div>;
//   }

//   const toggleExpand = (id) => {
//     setExpandedFeedback(expandedFeedback === id ? null : id);
//   };

//   const truncateMessage = (message) => {
//     const maxLength = 100;
//     return message.length > maxLength
//       ? `${message.slice(0, maxLength)}...`
//       : message;
//   };

//   const handleSortChange = (field, order) => {
//     setSortBy(field);
//     setSortOrder(order);
//     setShowMenu(false);
//   };

//   const sortedFeedbackList = [...feedbackList].sort((a, b) => {
//     if (sortBy === "username") {
//       const nameA = (a.username || "Anonymous").toLowerCase();
//       const nameB = (b.username || "Anonymous").toLowerCase();
//       return sortOrder === "asc"
//         ? nameA.localeCompare(nameB)
//         : nameB.localeCompare(nameA);
//     } else if (sortBy === "createdAt") {
//       const dateA = new Date(a.createdAt);
//       const dateB = new Date(b.createdAt);
//       return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
//     }
//     return 0;
//   });

//   // Paginate the sorted feedback list
//   const paginatedFeedbackList = sortedFeedbackList.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const totalPages = Math.ceil(feedbackTotal / pageSize);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
//       <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
//         Feedback List ({feedbackTotal})
//       </h2>

//       {/* Icon lọc */}
//       <div className="relative flex justify-end mb-4">
//         <button
//           className="p-2 border rounded-md bg-gray-100"
//           onClick={() => setShowMenu(!showMenu)}
//         >
//           <span className="text-orange-500 bg-orange-100">
//             <FiFilter />
//           </span>
//         </button>

//         {/* Dropdown menu */}
//         {showMenu && (
//           <div className="absolute right-0 mt-10 bg-white shadow-md rounded-md w-48">
//             <button
//               className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
//               onClick={() => handleSortChange("username", "asc")}
//             >
//               A → Z
//             </button>
//             <button
//               className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
//               onClick={() => handleSortChange("username", "desc")}
//             >
//               Z → A
//             </button>
//             <button
//               className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
//               onClick={() => handleSortChange("createdAt", "asc")}
//             >
//               Earliest
//             </button>
//             <button
//               className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
//               onClick={() => handleSortChange("createdAt", "desc")}
//             >
//               Latest
//             </button>
//           </div>
//         )}
//       </div>

//       <table className="table-fixed w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="w-1/4 border px-4 py-2">Username</th>
//             <th className="w-1/2 border px-4 py-2">Message</th>
//             <th className="w-1/4 border px-4 py-2">Received At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedFeedbackList.map((feedback) => {
//             const isLongMessage = feedback.message.length > 100;
//             return (
//               <tr key={feedback._id} className="hover:bg-gray-50 bg-white">
//                 <td className="text-sm border px-4 py-2">
//                   {feedback.name || "Anonymous"}
//                 </td>
//                 <td className="text-sm border px-4 py-2">
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                       expandedFeedback === feedback._id
//                         ? "max-h-full"
//                         : "max-h-[40px]"
//                     }`}
//                     style={{ whiteSpace: "pre-wrap" }}
//                   >
//                     {expandedFeedback === feedback._id
//                       ? feedback.message
//                       : truncateMessage(feedback.message)}
//                   </div>
//                   {isLongMessage && (
//                     <button
//                       onClick={() => toggleExpand(feedback._id)}
//                       className="text-blue-500 text-sm mt-2"
//                     >
//                       {expandedFeedback === feedback._id
//                         ? "Show less"
//                         : "Show more"}
//                     </button>
//                   )}
//                 </td>
//                 <td className="text-sm border px-4 py-2">
//                   {new Date(feedback.createdAt).toLocaleString()}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Pagination controls */}
//       {feedbackTotal > pageSize && (
//         <div className="flex justify-between mt-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-md"
//           >
//             Previous
//           </button>
//           <div className="flex items-center">
//             <span className="mr-2">
//               Page {currentPage} of {totalPages}
//             </span>
//           </div>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-300 rounded-md"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackList;

import { useState } from "react";
import useFeedback from "../../hooks/useFeedback";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const FeedbackList = () => {
  const [page, setPage] = useState(1);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const {
    feedbacks = [],
    loading,
    error,
    totalPages,
  } = useFeedback(page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleSelectOne = (feedbackId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id != feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(feedbacks.map((feedback) => feedback._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg ">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Feedback List
      </h2>

      <div className="flex items-center">
        <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="approveProducts">Approve selected products</option>
          <option value="deleteProducts">Delete selected products</option>
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
                    feedbacks.length > 0 &&
                    selectedCheckBox.length === feedbacks.length
                  }
                />
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Username <FaSort onClick={() => handleSort("username")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Message <FaSort onClick={() => handleSort("message")} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(feedback._id)}
                      onChange={() => handleSelectOne(feedback._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {feedback.username}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {feedback.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No feedbacks available.
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
    </div>
  );
};

export default FeedbackList;
