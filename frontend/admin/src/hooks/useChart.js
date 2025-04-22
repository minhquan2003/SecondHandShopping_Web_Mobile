import { useState, useEffect } from "react";
import axios from "axios";

const useChart = (year) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/statistics/yearly-users?year=${year}`
        );
        const result = await response.data;
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

export default useChart;
