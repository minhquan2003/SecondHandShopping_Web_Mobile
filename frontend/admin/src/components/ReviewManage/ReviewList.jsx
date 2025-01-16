import React, { useState } from "react";
import useReview from "../../hooks/useReview";

const ReviewList = () => {
  const { reviews, loading, error, deleteReview } = useReview();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  if (loading)
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Group reviews by product name
  const groupedReviews = reviews.reduce((groups, review) => {
    const { product_name } = review;
    if (!groups[product_name]) {
      groups[product_name] = [];
    }
    groups[product_name].push(review);
    return groups;
  }, {});

  const openDeletePopup = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowPopup(true);
  };

  const handleDelete = () => {
    if (selectedReviewId) {
      deleteReview(selectedReviewId);
    }
    setShowPopup(false);
    setSelectedReviewId(null);
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h1 className="text-2xl font-bold mb-4">Review Management</h1>
      <div className="overflow-x-auto">
        {Object.entries(groupedReviews).map(([productName, productReviews]) => (
          <div key={productName} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{productName}</h2>
            <table
              className="table-auto w-full border-collapse border border-gray-200"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Product Image
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Username
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    style={{ width: "8%" }}
                  >
                    Rating
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    style={{ width: "45%" }}
                  >
                    Content
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    style={{ width: "12%" }}
                  >
                    Review Date
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-left"
                    style={{ width: "8%" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {productReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={review.product_image || "placeholder.jpg"}
                        alt={review.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {review.username}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {review.rating}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {review.comment}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(review.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => openDeletePopup(review._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Popup for delete confirmation */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="text-lg mb-4">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
