import { useState, useEffect } from "react";
import axios from "axios";

function useFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/all-feedback"
        );
        if (response.data.success) {
          setFeedbackTotal(response.data.totalFeedbacks); // Tổng số feedback
          setFeedbackList(response.data.data); // Danh sách feedback
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return { feedbackList, feedbackTotal, loading }; // Trả về feedbackTotal
}

export default useFeedback;
