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
import { useChart } from "../../hooks/useDashboard";

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
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Nhãn trục X
    datasets: [
      {
        label: "Total Created Users",
        data: data.map((item) => item.totalUsers), // Dữ liệu trục Y
        borderColor: "rgba(255, 99, 132, 0.5)", // Màu đường
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu dưới đường
        fill: true,
        tension: 0.4, // Làm đường cong mượt
      },
    ],
  };

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <h2 className="text-xl mr-4 font-semibold">
          User Statistics - Year {selectedYear}
        </h2>

        <select
          id="year-select"
          onChange={handleYearChange}
          value={selectedYear}
          className="p-2 border border-gray-300 rounded-md"
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
        <div style={{ width: "100%", height: "0 auto" }}>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default ChartUserYears;
