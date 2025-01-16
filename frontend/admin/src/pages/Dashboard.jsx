// src/pages/Dashboard.jsx
import React from "react";
// import StatisticsChart from "../components/Dashboard/StatisticsChart.jsx";
import AccountOverview from "../components/Dashboard/AccountOverview.jsx";
import TopTenOrder from "../components/ui/TopTenOrder.jsx";
import ChartUserYears from "../components/Dashboard/ChartUserYears.jsx";
import OrderProductChart from "../components/Dashboard/OrderProductChart.jsx";

const Dashboard = () => {
  return (
    <div className="bg-gray-100">
      <AccountOverview />
      <TopTenOrder />
      <ChartUserYears />
      {/* <StatisticsChart /> */}
      <OrderProductChart />
    </div>
  );
};

export default Dashboard;
