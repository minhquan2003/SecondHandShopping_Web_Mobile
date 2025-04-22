import Feedbacks from "../../../User/models/Feedbacks.js";
import Users from "../../../User/models/Users.js"; // Make sure to import the Users model

// const getAllFeedbacks = async (page = 1, limit = 10, sort, filter) => {
//   try {
//     const query = { status: true };
//     const skip = (page - 1) * limit;
//     if (filter) {
//       const label = filter[0];
//       const value = filter[1];
//       query[label] = { $regex: value, $options: "i" };
//       const filterFeedbacks = await Feedbacks.find(query)
//         .skip(skip)
//         .limit(limit)
//         .lean();
//       for (const feedback of filterFeedbacks) {
//         const user = await Users.findById(feedback.user_id).lean();

//         feedback.username = user?.name || "Unknown User";
//       }
//       const totalFeedbacks = await Feedbacks.countDocuments(query);
//       const totalPages = await Math.ceil(totalFeedbacks / limit);
//       return {
//         totalFeedbacks,
//         totalPages,
//         limit,
//         currentPage: page,
//         feedbacks: filterFeedbacks,
//       };
//     }

//     const totalFeedbacks = await Feedbacks.countDocuments(query);
//     const totalPages = Math.ceil(totalFeedbacks / limit);

//     if (sort) {
//       const objectSort = {};
//       objectSort[sort[1]] = sort[0];
//       const sortFeedbacks = await Feedbacks.find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort(objectSort)
//         .lean();
//       for (const feedback of sortFeedbacks) {
//         const user = await Users.findById(feedback.user_id).lean();
//         feedback.username = user?.name || "Unknown User";
//       }
//       return {
//         totalFeedbacks,
//         totalPages,
//         limit,
//         currentPage: page,
//         feedbacks: sortFeedbacks,
//       };
//     }

//     const feedbacks = await Feedbacks.find(query)
//       .limit(limit)
//       .skip(skip)
//       .lean();

//     for (const feedback of feedbacks) {
//       const user = await Users.findById(feedback.user_id).lean();

//       feedback.username = user?.name || "Unknown User";
//     }

//     return {
//       feedbacks,
//       totalFeedbacks,
//       totalPages,
//       limit,
//       currentPage: page,
//     };
//   } catch (error) {
//     throw new Error("Error fetching feedbacks: " + error.message);
//   }
// };

const getAllFeedbacks = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = {
      status: true,
    };
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          user_id: {
            $convert: {
              input: "$user_id",
              to: "objectId",
              onError: "$user_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          username: {
            $ifNull: ["$user.name", "Unknown User"],
          },
        },
      },
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: {
                  $regex: filter[1],
                  $options: "i",
                },
              },
            },
          ]
        : []),
      { $project: { user: 0 } },
      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),
      { $skip: skip },
      { $limit: limit },
    ];

    const feedbacks = await Feedbacks.aggregate(pipeline);
    const totalFeedbacks = await Feedbacks.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limit);
    return {
      feedbacks,
      totalFeedbacks,
      totalPages,
      limit,
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};
export { getAllFeedbacks };
