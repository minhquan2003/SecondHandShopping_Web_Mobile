import React from "react";

const ProductOverview = () => {
  return (
    <div className="container mx-auto p-4 bg-white rounded-md mt-4">
      <h1 className="text-2xl font-semibold mb-4">Product Sumary</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <i className="text-4xl text-gray-600">📦</i>
          </div>
          <div className="text-lg font-medium">50</div>
          <div className="text-sm text-gray-500">Number of supplies</div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <i className="text-4xl text-gray-600">📦</i>
          </div>
          <div className="text-lg font-medium">30</div>
          <div className="text-sm text-gray-500">Number of categories</div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
