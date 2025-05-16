import { useState } from "react";
import useReview from "../../hooks/useReview";
import { FaSort, FaSearch } from "react-icons/fa";

const ReviewList = () => {
  const [page, setPage] = useState(1);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const {
    reviews = [],
    loading,
    error,
    totalPages,
    deleteReview,
  } = useReview(page, fieldSort, orderSort, searchKey);
  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one review.");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected reviews?")) {
      deleteReview(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (reviewId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id != reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(reviews.map((review) => review._id));
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
            if (e.target.value == "deleteReviews") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteReviews">Delete selected reviews</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by buyer name..."
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
                    reviews.length > 0 &&
                    selectedCheckBox.length === reviews.length
                  }
                />
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Product Image
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Product Name{" "}
                  <FaSort onClick={() => handleSort("product_name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  User Name <FaSort onClick={() => handleSort("username")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Rating <FaSort onClick={() => handleSort("rating")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Content <FaSort onClick={() => handleSort("comment")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Review Date <FaSort onClick={() => handleSort("createdAt")} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(review._id)}
                      onChange={() => handleSelectOne(review._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <img
                      src={review.product_image}
                      alt={review.product_name}
                      className="w-16 h-16 rounded mr-4"
                    />
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {review.product_name}
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {review.username}
                  </td>
                  <td className="text-sm border px-4 py-2">{review.rating}</td>
                  <td className="text-sm border px-4 py-2">{review.comment}</td>
                  <td className="text-sm border px-4 py-2">
                    {new Date(review.createdAt).toLocaleString()}
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

export default ReviewList;
