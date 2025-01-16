import Users from "../../../User/models/Users.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";

// export const getUserStatisticsByYear = async (year) => {
//   try {
//     const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
//     const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
//     const startOfPreviousYear = new Date(`${year - 1}-01-01T00:00:00Z`);
//     const endOfPreviousYear = new Date(`${year - 1}-12-31T23:59:59Z`);

//     // Lấy tổng số người dùng tích lũy đến cuối năm trước
//     const previousYearTotal = await Users.countDocuments({
//       createdAt: { $lte: endOfPreviousYear },
//     });

//     // Lấy số lượng người dùng mới tạo trong từng tháng của năm hiện tại
//     const statistics = await Users.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: startOfYear,
//             $lte: endOfYear,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           totalUsers: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           month: "$_id",
//           totalUsers: 1,
//           _id: 0,
//         },
//       },
//       {
//         $sort: { month: 1 },
//       },
//     ]);

//     // Đảm bảo tất cả các tháng (1-12) đều có dữ liệu
//     const fullStatistics = Array.from({ length: 12 }, (_, i) => ({
//       month: i + 1,
//       totalUsers: 0,
//     }));

//     statistics.forEach((stat) => {
//       fullStatistics[stat.month - 1].totalUsers = stat.totalUsers;
//     });

//     // Tính tổng tích lũy, với tháng 1 bắt đầu từ tổng của năm trước
//     let cumulativeTotal = previousYearTotal;
//     const cumulativeStatistics = fullStatistics.map((stat) => {
//       cumulativeTotal += stat.totalUsers;
//       return { month: stat.month, totalUsers: cumulativeTotal };
//     });

//     return cumulativeStatistics;
//   } catch (error) {
//     throw new Error("Error calculating user statistics");
//   }
// };

export const getUserStatisticsByYear = async (year) => {
  try {
    // Sử dụng MongoDB aggregation pipeline
    const startOfYear = new Date(year, 0, 1); // 1st Jan of the year
    const endOfYear = new Date(year + 1, 0, 1); // 1st Jan of the next year

    const statistics = await Users.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          totalUsers: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Tạo một mảng kết quả với tất cả 12 tháng, mặc định số lượng người dùng là 0
    const result = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalUsers: 0,
    }));

    // Cập nhật số lượng người dùng cho từng tháng trong kết quả
    statistics.forEach((stat) => {
      result[stat.month - 1].totalUsers = stat.totalUsers;
    });

    return result;
  } catch (error) {
    console.error("Error while fetching user statistics by year:", error);
    throw error;
  }
};

export const getMonthlyStatistics = async (year) => {
  try {
    // Aggregate products for the specified year with status true and approved true
    const productStats = await Products.aggregate([
      {
        $match: {
          status: true,
          approve: true,
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalProducts: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Aggregate orders for the specified year with status true and order status success
    const orderStats = await Orders.aggregate([
      {
        $match: {
          status: true,
          status_order: "Success",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Initialize months from 1 to 12 with default 0 for both products and orders
    const result = [];
    for (let i = 1; i <= 12; i++) {
      const productMonth = productStats.find((stat) => stat._id === i);
      const orderMonth = orderStats.find((stat) => stat._id === i);

      result.push({
        month: i,
        totalProducts: productMonth ? productMonth.totalProducts : 0,
        totalOrders: orderMonth ? orderMonth.totalOrders : 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};
