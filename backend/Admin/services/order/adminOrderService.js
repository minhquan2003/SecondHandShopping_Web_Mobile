import OrderDetails from "../../../User/models/OrderDetails.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";

// Function to format the total amount in readable units (e.g., trillion, million, etc.)
const formatAmount = (amount) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)} Tỷ`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)} Triệu`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)} Triệu`;
  return amount;
};

export const getOrderStats = async () => {
  try {
    // Aggregate orders to calculate totals
    const stats = await Orders.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalMoney: {
            $sum: {
              $cond: [
                { $eq: ["$status_order", "Success"] }, // Condition to check if status_order is "Success"
                "$total_amount", // Sum total_amount if condition is met
                0, // Otherwise, add 0
              ],
            },
          },
          totalCancelled: {
            $sum: { $cond: [{ $eq: ["$status_order", "Cancelled"] }, 1, 0] },
          },
          totalSuccessful: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status_order", "Success"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalOrders: 0,
        totalMoney: 0,
        totalCancelled: 0,
        totalSuccessful: 0,
      };
    }

    const { totalOrders, totalMoney, totalCancelled, totalSuccessful } =
      stats[0];

    return {
      totalOrders,
      totalMoney: formatAmount(totalMoney),
      totalCancelled,
      totalSuccessful,
    };
  } catch (error) {
    throw new Error(`Error fetching order statistics: ${error.message}`);
  }
};

export const getTopSellingProducts = async (timeFrame) => {
  try {
    // Xác định khoảng thời gian lọc
    let startDate;
    const currentDate = new Date();

    if (timeFrame === "day") {
      startDate = new Date(currentDate.setHours(0, 0, 0, 0)); // Đầu ngày
    } else if (timeFrame === "week") {
      const startOfWeek = currentDate.getDate() - currentDate.getDay();
      startDate = new Date(currentDate.setDate(startOfWeek));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFrame === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Đầu tháng
    } else if (timeFrame === "year") {
      startDate = new Date(currentDate.getFullYear(), 0, 1); // Đầu năm
    } else {
      throw new Error("Invalid time frame provided");
    }

    // Lọc đơn hàng theo thời gian
    const topProducts = await OrderDetails.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$product_id",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    // Lấy thông tin chi tiết sản phẩm (tên và ảnh)
    const productIds = topProducts.map((item) => item._id);
    const productDetails = await Products.find({
      _id: { $in: productIds },
    }).select("name image_url");

    // Kết hợp dữ liệu
    const result = topProducts.map((item) => {
      const product = productDetails.find(
        (p) => p._id.toString() === item._id.toString()
      );
      return {
        productId: item._id,
        name: product?.name || "Unknown",
        image_url: product?.image_url || "",
        totalQuantity: item.totalQuantity,
      };
    });

    return result;
  } catch (error) {
    throw new Error(`Error fetching top selling products: ${error.message}`);
  }
};

export const getAllOrders = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    // Lấy danh sách đơn hàng với phân trang
    const orders = await Orders.find().skip(skip).limit(limit).lean();

    if (!orders.length) throw new Error("No orders found");

    // Lấy tất cả các orderDetail và sản phẩm liên quan
    const orderIds = orders.map((order) => order._id.toString());
    const orderDetails = await OrderDetails.find({
      order_id: { $in: orderIds },
    }).lean();

    const productIds = orderDetails.map((od) => od.product_id);
    const products = await Products.find({
      _id: { $in: productIds },
    }).lean();

    // Map dữ liệu chi tiết vào từng đơn hàng
    const detailedOrders = orders.map((order) => {
      const items = orderDetails
        .filter((od) => od.order_id === order._id.toString())
        .map((od) => {
          const product = products.find(
            (p) => p._id.toString() === od.product_id
          );
          return {
            productId: od.product_id,
            productName: product?.name || "Unknown product",
            price: od.price,
            quantity: od.quantity,
            total: od.price * od.quantity,
          };
        });

      return {
        ...order,
        items,
        totalAmount: items.reduce((sum, item) => sum + item.total, 0),
      };
    });

    return detailedOrders;
  } catch (error) {
    throw new Error(`Failed to get orders: ${error.message}`);
  }
};

export const findOrdersByName = async (name, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit; // Tính toán vị trí bắt đầu của phân trang

    // Tìm kiếm đơn hàng dựa trên name và áp dụng phân trang
    const orders = await Orders.find({
      name: { $regex: name, $options: "i" }, // Tìm kiếm khớp tên, không phân biệt chữ hoa chữ thường
    })
      .skip(skip) // Áp dụng phân trang
      .limit(limit) // Giới hạn số lượng kết quả
      .lean();

    return orders;
  } catch (error) {
    throw new Error(`Error finding orders by name: ${error.message}`);
  }
};
