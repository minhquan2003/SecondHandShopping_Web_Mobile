import { useState, useEffect } from "react";
import axios from "axios";

const useFeedback = (page = 1, fieldSort, orderSort, searchKey) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      let url = `http://localhost:5555/admin/all-feedback?page=${page}`;

      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }

      if (searchKey) {
        url += `&filter=username&filter=${searchKey}`;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url);

        const data = await response.data;
        if (data.success && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [page, fieldSort, orderSort, searchKey]);

  return { feedbacks, totalPages, loading, error }; // Trả về feedbackTotal
};

export default useFeedback;
