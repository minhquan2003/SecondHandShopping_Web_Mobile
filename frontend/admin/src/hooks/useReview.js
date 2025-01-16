import { useState, useEffect } from "react";
import axios from "axios";

const useReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5555/admin/reviews?page=${page}`
      );
      setReviews(response.data.data); // Assuming `data` contains the reviews
      setTotalPages(response.data.totalPages || 1); // Assuming `totalPages` is in the response
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/admin/reviews/${id}`);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  return {
    reviews,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    deleteReview,
  };
};

export default useReview;
