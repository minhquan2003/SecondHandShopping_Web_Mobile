// hooks/useChart.js
import { useState, useEffect } from "react";
import axios from "axios";

const useChartOrderProduct = (year) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          `http://localhost:5555/admin/statistics?year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return { data, loading };
};

export default useChartOrderProduct;
