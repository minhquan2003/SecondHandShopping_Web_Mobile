import Users from "../../../User/models/Users.js";
import Reviews from "../../../User/models/Reviews.js";
import Products from "../../../User/models/Products.js";

export const getAllReviews = async () => {
  try {
    const reviews = await Reviews.find({ status: true }).lean();

    // Fetch related user and product information for each review
    const reviewDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await Users.findById(review.user_id, "username").lean();
        const product = await Products.findById(
          review.product_id,
          "name image_url"
        ).lean();

        return {
          ...review,
          username: user?.username || "Unknown User",
          product_name: product?.name || "Unknown Product",
          product_image: product?.image_url || "",
        };
      })
    );

    return reviewDetails;
  } catch (error) {
    throw new Error(`Error fetching reviews: ${error.message}`);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    // Update review status to false
    const updatedReview = await Reviews.findByIdAndUpdate(
      reviewId,
      { status: false },
      { new: true } // Return the updated document
    ).lean();

    if (!updatedReview) {
      throw new Error("Review not found");
    }

    return updatedReview;
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};
