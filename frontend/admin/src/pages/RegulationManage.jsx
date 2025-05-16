import { useState } from "react";

import RegulationList from "../components/RegulationManage/RegulationList";
import RegulationPost from "../components/RegulationManage/RegulationPost";

const RegulationManage = () => {
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [showRegulationForm, setShowRegulationForm] = useState(false);
  const openCategoryForm = (regulation = null) => {
    setSelectedRegulation(regulation);
    setShowRegulationForm(true);
  };
  const closeCategoryForm = () => {
    setSelectedRegulation(null);
    setShowRegulationForm(false);
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 pl-4">Regulation List</h2>
      <div className="mt-4 pl-4">
        <button
          onClick={() => openCategoryForm()}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Regulation
        </button>
      </div>
      <div className="mb-6">
        {showRegulationForm && (
          <RegulationPost
            selectedRegulation={selectedRegulation}
            closeForm={closeCategoryForm}
          />
        )}
      </div>

      <div>
        <RegulationList openCategoryForm={openCategoryForm} />
      </div>
    </div>
  );
  // return (
  //   <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
  //     <RegulationPost />
  //     <RegulationList />
  //   </div>
  // );
};

export default RegulationManage;
