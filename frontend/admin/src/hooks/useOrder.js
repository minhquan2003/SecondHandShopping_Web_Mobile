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
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
          "http://localhost:5555/admin/order-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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

const useOrders = (
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      let url = `http://localhost:5555/admin/orders?page=${page}`;
      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }
      if (searchKey) {
        url += `&filter=name_buyer&filter=${searchKey}`;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        if (data.success && Array.isArray(data.orderdetails)) {
          setOrders(data.orderdetails);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, fieldSort, orderSort, searchKey]);

  return { orders, loading, error, totalPages };
};

export { useTopSellingProducts, usePurchaseOverview, useOrders };
