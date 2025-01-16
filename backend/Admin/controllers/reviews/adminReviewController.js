import {
  getAllReviews,
  deleteReview,
} from "../../services/reviews/adminReviewService.js";

export const fetchAllReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await deleteReview(id);

    return res.status(200).json({
      success: true,
      message: "Review has been deleted successfully",
      data: deletedReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
