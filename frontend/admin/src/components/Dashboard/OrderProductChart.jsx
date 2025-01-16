// // src/components/StatisticsChart.js
// import React, { useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const StatisticsChart = () => {
//   const [year, setYear] = useState(2023); // Mặc định chọn năm 2023

//   // Dữ liệu giả lập cho các tháng trong năm
//   const data = {
//     2023: {
//       orders: [120, 130, 125, 140, 150, 160, 170, 165, 155, 145, 160, 175],
//       posts: [100, 110, 115, 105, 120, 125, 130, 135, 140, 145, 150, 155],
//     },
//     2024: {
//       orders: [100, 120, 110, 140, 145, 150, 160, 165, 170, 160, 150, 180],
//       posts: [90, 100, 105, 115, 120, 130, 125, 135, 140, 155, 160, 165],
//     },
//   };

//   // Chọn dữ liệu theo năm
//   const selectedData = data[year];

//   const chartData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Order",
//         data: selectedData.orders,
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 1,
//       },
//       {
//         label: "Product",
//         data: selectedData.posts,
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         borderColor: "rgba(255, 99, 132, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Order & Product Statistics</h2>
//         <select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className="p-2 border border-gray-300 rounded-md"
//         >
//           <option value={2023}>2023</option>
//           <option value={2024}>2024</option>
//         </select>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <Bar data={chartData} />
//       </div>
//     </div>
//   );
// };

// export default StatisticsChart;
// src/components/OrderProductChart.jsx
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useChartOrderProduct from "../../hooks/useChartOrderPro";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = () => {
  // Tính toán năm hiện tại và năm cuối cùng (năm hiện tại + 1)
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear + 1;
  const startYear = 2021;

  // Tạo mảng các năm từ 2021 đến năm hiện tại + 1
  const years = Array.from(
    { length: lastYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const [year, setYear] = useState(currentYear); // Mặc định là năm hiện tại

  // Fetch dữ liệu từ hook
  const { data, loading } = useChartOrderProduct(year);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Chuẩn bị dữ liệu cho chart
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
    ],
    datasets: [
      {
        label: "Orders",
        data: data.map((item) => item.totalOrders), // Giả sử totalOrders có trong dữ liệu
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Products",
        data: data.map((item) => item.totalProducts), // Giả sử totalProducts có trong dữ liệu
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order & Product Statistics</h2>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default StatisticsChart;
