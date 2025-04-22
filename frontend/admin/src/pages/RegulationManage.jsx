import React from "react";

import RegulationList from "../components/RegulationManage/RegulationList";
import RegulationPost from "../components/RegulationManage/RegulationPost";

const RegulationManage = () => {
  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <RegulationPost />
      <RegulationList />
    </div>
  );
};

export default RegulationManage;
