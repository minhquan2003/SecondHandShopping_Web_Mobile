import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useChart from "../../hooks/useChart";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Title);

const StatisticsChart = () => {
  const [timeframe, setTimeframe] = useState("month");
  const { data, loading, error } = useChart(timeframe);

  // Chart Data
  const chartData = {
    labels: data
      ? data.users.map((item) => {
          switch (timeframe) {
            case "week":
              return `Week ${item._id}`;
            case "month":
              return `${new Date(0, item._id - 1).toLocaleString("default", {
                month: "long",
              })} ${new Date().getFullYear()}`;
            case "year":
              return `${item._id}`;
            default:
              return item._id;
          }
        })
      : [],
    datasets: [
      {
        label: "Users",
        data: data ? data.users.map((item) => item.count) : [],
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Products",
        data: data ? data.products.map((item) => item.count) : [],
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Green
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="ml-[16.6666%] p-4 bg-gray-100 rounded-md border-b-2 border-black-300 pb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4  mx-4">Statistics</h2>

      {/* Timeframe Selection */}
      <div className="flex gap-4 mb-4  mx-4">
        <button
          onClick={() => setTimeframe("week")}
          className={`px-4 py-2 rounded ${
            timeframe === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimeframe("month")}
          className={`px-4 py-2 rounded ${
            timeframe === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimeframe("year")}
          className={`px-4 py-2 rounded ${
            timeframe === "year" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Chart */}
      {!loading && data && (
        <div className="relative" style={{ height: "300px" }}>
          {" "}
          {/* Set a fixed height */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default StatisticsChart;
