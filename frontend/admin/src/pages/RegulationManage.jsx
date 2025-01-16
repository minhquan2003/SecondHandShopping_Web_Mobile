import React from "react";

import RegulationList from "../components/RegulationManage/RegulationList";
import RegulationPost from "../components/RegulationManage/RegulationPost";

const RegulationManage = () => {
  return (
    <div>
      <RegulationPost />
      <RegulationList />
    </div>
  );
};

export default RegulationManage;
