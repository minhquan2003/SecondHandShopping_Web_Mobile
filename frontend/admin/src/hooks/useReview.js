import { useState, useEffect } from "react";
import axios from "axios";

const useReview = (page = 1) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      let url = `http://localhost:5555/admin/reviews?page=${page}`;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page]);

  const deleteReview = async (selectedIds) => {
    try {
      await axios.delete(
        "http://localhost:5555/admin/reviews",
        {
          reviewIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReviews((prev) =>
        prev.filter((review) => !selectedIds.includes(review._id))
      );
      alert("Selected review delected successfully!");
    } catch {
      alert("Failed to delete selected review!");
    }
  };

  return {
    reviews,
    loading,
    error,
    totalPages,
    deleteReview,
  };
};

export default useReview;
