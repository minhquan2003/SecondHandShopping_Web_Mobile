// hooks/useChart.js
import { useState, useEffect } from "react";

const useChartOrderProduct = (year) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5555/admin/statistics?year=${year}`
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
