import {
  getTopSellingProducts,
  getOrderStats,
  getAllOrders,
  findOrdersByName,
} from "../../services/order/adminOrderService.js";

export const searchOrdersByName = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query; // Lấy giá trị tham số từ query string, mặc định là trang 1 và limit 10

    if (!name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }

    const orders = await findOrdersByName(name, page, limit);

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found with the given name" });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchTopSellingProducts = async (req, res) => {
  try {
    const { timeFrame } = req.query; // Lấy timeFrame từ query string
    if (!["day", "week", "month", "year"].includes(timeFrame)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time frame. Allowed values: day, week, month, year.",
      });
    }

    const topProducts = await getTopSellingProducts(timeFrame);
    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchOrderStats = async (req, res) => {
  try {
    const stats = await getOrderStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Chuyển đổi page và limit thành số nguyên
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (currentPage < 1 || pageSize < 1) {
      return res.status(400).json({ message: "Invalid page or limit value" });
    }

    const orders = await getAllOrders(currentPage, pageSize);

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
      page: currentPage,
      limit: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
