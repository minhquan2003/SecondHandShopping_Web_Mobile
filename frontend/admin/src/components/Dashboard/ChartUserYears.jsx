import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useChart from "../../hooks/useChart";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartUserYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2021; // Bắt đầu từ năm 2021
  const years = Array.from(
    { length: currentYear - startYear + 2 },
    (_, i) => startYear + i
  );

  const [selectedYear, setSelectedYear] = useState(currentYear); // Mặc định là năm hiện tại
  const { data, loading } = useChart(selectedYear);

  // Xử lý thay đổi năm
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: data.map((item) => `Month ${item.month}`), // Nhãn trục X
    datasets: [
      {
        label: "Total Created Users",
        data: data.map((item) => item.totalUsers), // Dữ liệu trục Y
        borderColor: "#4caf50", // Màu đường
        backgroundColor: "rgba(76, 175, 80, 0.2)", // Màu dưới đường
        fill: true,
        tension: 0.4, // Làm đường cong mượt
      },
    ],
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md px-8 border-b-2 border-black-300 pb-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        User Statistics - Year {selectedYear}
      </h2>

      <div className="mb-4">
        <label htmlFor="year-select" className="mr-2">
          Select Year:
        </label>
        <select
          id="year-select"
          onChange={handleYearChange}
          value={selectedYear}
          className="border border-gray-300 p-2 rounded-md"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div style={{ width: "100%", height: "450px" }}>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default ChartUserYears;
