// import Feedbacks from "../../../User/models/Feedbacks.js"; 

// const getAllFeedbacks = async (page, limit) => {
//   try {
//     const feedbacks = await Feedbacks.find()
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const totalFeedbacks = await Feedbacks.countDocuments();

//     return {
//       feedbacks,
//       totalFeedbacks,
//       totalPages: Math.ceil(totalFeedbacks / limit),
//       currentPage: page,
//     };
//   } catch (error) {
//     throw new Error("Error fetching feedbacks: " + error.message);
//   }
// };

// export { getAllFeedbacks };

import Feedbacks from "../../../User/models/Feedbacks.js";
import Users from "../../../User/models/Users.js"; // Make sure to import the Users model

const getAllFeedbacks = async () => {
  try {
    // Fetch all feedbacks along with user details
    const feedbacks = await Feedbacks.find({ status: true }).lean();

    for (const feedback of feedbacks) {
      // Ensure the user_id is valid
      if (feedback.user_id) {
        const user = await Users.findById(feedback.user_id);

        feedback.name = user?.name || "Unknown User";
      } else {
        feedback.name = "Unknown User";
      }
    }

    // Count the total number of feedbacks
    const totalFeedbacks = await Feedbacks.countDocuments({ status: true });

    return {
      totalFeedbacks,
      feedbacks,
    };
  } catch (error) {
    throw new Error("Error fetching feedbacks: " + error.message);
  }
};

export { getAllFeedbacks };
