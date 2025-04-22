// src/pages/Dashboard.jsx
import React from "react";
// import StatisticsChart from "../components/Dashboard/StatisticsChart.jsx";
import AccountOverview from "../components/ui/AccountOverview.jsx";
import TopTenOrder from "../components/Dashboard/TopTenOrder.jsx";
import ChartUserYears from "../components/Dashboard/ChartUserYears.jsx";
import OrderProductChart from "../components/Dashboard/OrderProductChart.jsx";

const Dashboard = () => {
  return (
    <div className="bg-gray-100">
      <TopTenOrder />
      <ChartUserYears />
      <OrderProductChart />
    </div>
  );
};

export default Dashboard;
