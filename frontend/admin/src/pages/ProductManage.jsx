import React, { useState } from "react";
import ProductRequest from "../components/ProductManage/ProductRequest.jsx";
import ProductList from "../components/ProductManage/ProductList.jsx";
import PurchaseOverview from "../components/ui/PurchaseOverview.jsx";

const ProductManage = () => {
  const [view, setView] = useState("request"); // Default view is 'request' for pending products

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <PurchaseOverview />
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Product Management
      </h2>

      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setView("request")}
          className={`px-4 py-2 rounded-md ${
            view === "request"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Pending Approvals
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-md ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Products List
        </button>
      </div>

      {view === "request" ? <ProductRequest /> : <ProductList />}
    </div>
  );
};

export default ProductManage;
