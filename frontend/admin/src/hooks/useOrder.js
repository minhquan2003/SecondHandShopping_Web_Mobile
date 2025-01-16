import { useState, useEffect } from "react";
import axios from "axios";

const useTopSellingProducts = (timeFrame) => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/top-selling-products`,
          {
            params: { timeFrame },
          }
        );
        setTopProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (timeFrame) {
      fetchTopProducts();
    }
  }, [timeFrame]);

  return { topProducts, loading, error };
};

const usePurchaseOverview = () => {
  const [overviewData, setOverviewData] = useState({
    totalOrders: 0,
    totalAmount: "",
    totalCancelledOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseOverview = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/order-stats"
        );
        setOverviewData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPurchaseOverview();
  }, []);

  return { overviewData, loading, error };
};

const useOrders = (page, limit) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5555/admin/orders", {
          params: { page, limit },
        });
        setOrders(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  return { orders, loading, error };
};

const useSearchOrder = (page, limit, name) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!name) return; // Nếu không có từ khóa tìm kiếm, không gọi API
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5555/admin/search-orders",
          { params: { page, limit, name } }
        );
        setOrders(response.data.data);
        setError(null); // Xóa lỗi trước đó
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setOrders([]); // Trả về danh sách rỗng nếu không tìm thấy
          setError("No orders found");
        } else {
          setError("An error occurred"); // Xử lý lỗi khác
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, name]);

  return { orders, loading, error };
};

export {
  useTopSellingProducts,
  usePurchaseOverview,
  useOrders,
  useSearchOrder,
};
