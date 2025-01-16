import React, { useState, useEffect } from "react";
import { useOrders, useSearchOrder } from "../../hooks/useOrder";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const limit = 10; // Number of orders per page

  // Hook for searching orders
  const {
    orders: searchOrders,
    loading: searchLoading,
    error: searchError,
  } = useSearchOrder(page, limit, searchTerm);

  // Hook for getting all orders
  const { orders, loading, error } = useOrders(page, limit);

  // Decide which orders to display based on search term
  const displayOrders = searchTerm ? searchOrders : orders;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  if (searchLoading || loading) return <p>Loading orders...</p>;
  if (searchError || error) return <p>Error: {searchError || error}</p>;

  // Ensure displayOrders is an array before using .map
  if (!Array.isArray(displayOrders)) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
      <h1 className="text-2xl font-semibold mb-4 text-blue-600">Order List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by buyer name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 w-full border rounded-md"
      />

      {/* Display a message if no results were found */}
      {searchTerm && searchOrders.length === 0 && (
        <p className="text-red-500 font-semibold mb-4">
          No orders found with the given name.
        </p>
      )}

      {/* Orders Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Buyer Name
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Product Name
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Quantity
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Total Price
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Phone
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Address
            </th>
            <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {displayOrders.length > 0 ? (
            displayOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{order.name}</td>
                <td className="border px-4 py-2 text-center">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.productId}>{item.productName}</div>
                    ))
                  ) : (
                    <div>No items available</div>
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.productId}>{item.quantity}</div>
                    ))
                  ) : (
                    <div>No quantity available</div>
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.totalAmount}
                </td>
                <td className="border px-4 py-2 text-center">{order.phone}</td>
                <td className="border px-4 py-2 text-center">
                  {order.address}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.status_order}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center">
                No orders available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center mt-4 justify-center">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 text-blue-600 hover:text-blue-400 rounded disabled:opacity-50"
        >
          <MdArrowBackIos />
        </button>
        <span className="text-lg mx-4">{page}</span>
        <button
          onClick={handleNextPage}
          disabled={displayOrders.length < limit}
          className="px-4 py-2 text-blue-600 rounded hover:text-blue-400 disabled:opacity-50"
        >
          <MdArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default OrderList;
