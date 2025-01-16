import { getAllFeedbacks } from "../../services/feedback/adminFeedbackService.js";

const getFeedbacks = async (req, res) => {
  try {
    const feedbackData = await getAllFeedbacks();

    res.status(200).json({
      success: true,
      totalFeedbacks: feedbackData.totalFeedbacks, // Tổng số feedback
      data: feedbackData.feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getFeedbacks };
