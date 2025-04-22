// import React, { useState, useEffect } from "react";
// import { useOrders, useSearchOrder } from "../../hooks/useOrder";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

// const OrderList = () => {
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term
//   const limit = 10; // Number of orders per page

//   // Hook for searching orders
//   const {
//     orders: searchOrders,
//     loading: searchLoading,
//     error: searchError,
//   } = useSearchOrder(page, limit, searchTerm);

//   // Hook for getting all orders
//   const { orders, loading, error } = useOrders(page, limit);

//   // Decide which orders to display based on search term
//   const displayOrders = searchTerm ? searchOrders : orders;

//   const handleNextPage = () => setPage((prev) => prev + 1);
//   const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value); // Update search term
//   };

//   if (searchLoading || loading) return <p>Loading orders...</p>;
//   if (searchError || error) return <p>Error: {searchError || error}</p>;

//   // Ensure displayOrders is an array before using .map
//   if (!Array.isArray(displayOrders)) {
//     return <p>No orders found.</p>;
//   }

//   return (
//     <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
//       <h1 className="text-2xl font-semibold mb-4 text-blue-600">Order List</h1>

//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search by buyer name"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         className="mb-4 p-2 w-full border rounded-md"
//       />

//       {/* Display a message if no results were found */}
//       {searchTerm && searchOrders.length === 0 && (
//         <p className="text-red-500 font-semibold mb-4">
//           No orders found with the given name.
//         </p>
//       )}

//       {/* Orders Table */}
//       <table className="min-w-full bg-white border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Buyer Name
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Product Name
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Quantity
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Total Price
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Phone
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Address
//             </th>
//             <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
//               Status
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayOrders.length > 0 ? (
//             displayOrders.map((order) => (
//               <tr key={order._id} className="border-b hover:bg-gray-50">
//                 <td className="border px-4 py-2 text-center">{order.name}</td>
//                 <td className="border px-4 py-2 text-center">
//                   {order.items && order.items.length > 0 ? (
//                     order.items.map((item) => (
//                       <div key={item.productId}>{item.productName}</div>
//                     ))
//                   ) : (
//                     <div>No items available</div>
//                   )}
//                 </td>
//                 <td className="border px-4 py-2 text-center">
//                   {order.items && order.items.length > 0 ? (
//                     order.items.map((item) => (
//                       <div key={item.productId}>{item.quantity}</div>
//                     ))
//                   ) : (
//                     <div>No quantity available</div>
//                   )}
//                 </td>
//                 <td className="border px-4 py-2 text-center">
//                   {order.totalAmount}
//                 </td>
//                 <td className="border px-4 py-2 text-center">{order.phone}</td>
//                 <td className="border px-4 py-2 text-center">
//                   {order.address}
//                 </td>
//                 <td className="border px-4 py-2 text-center">
//                   {order.status_order}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="p-4 text-center">
//                 No orders available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center mt-4 justify-center">
//         <button
//           onClick={handlePreviousPage}
//           disabled={page === 1}
//           className="px-4 py-2 text-blue-600 hover:text-blue-400 rounded disabled:opacity-50"
//         >
//           <MdArrowBackIos />
//         </button>
//         <span className="text-lg mx-4">{page}</span>
//         <button
//           onClick={handleNextPage}
//           disabled={displayOrders.length < limit}
//           className="px-4 py-2 text-blue-600 rounded hover:text-blue-400 disabled:opacity-50"
//         >
//           <MdArrowForwardIos />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderList;

import React, { useState } from "react";
import { useOrders } from "../../hooks/useOrder";
import { TbListDetails } from "react-icons/tb";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");

  const {
    orders = [],
    loading,
    error,
    totalPages,
  } = useOrders(page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleViewDetails = (order) => {
    selectedOrder(order);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Order Manage
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select className="border border-black p-2 mb-4" defaultValue="choose">
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteRolePartners">
            Delete selected role partners
          </option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by buyer name..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Buyer Name <FaSort onClick={() => handleSort("name_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Product Name{" "}
                  <FaSort onClick={() => handleSort("product_name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Quantity <FaSort onClick={() => handleSort("quantity")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Total Price <FaSort onClick={() => handleSort("price")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Phone <FaSort onClick={() => handleSort("phone_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Address <FaSort onClick={() => handleSort("address_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="inline-flex items-center gap-x-2">
                  Status Order{" "}
                  <FaSort onClick={() => handleSort("status_order")} />
                </span>
              </th>
              <th className="border px-2 py-2 text-center">Detail</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border">
                  <td className="border px-4 py-2 text-center">
                    {order.name_buyer}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {order.product_name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {order.quantity}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {order.price}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {order.phone_buyer}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {order.address_buyer}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {order.status_order}
                  </td>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No users available.
                  {console.log(orders)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedOrder.avatar_url}
                alt="Avatar"
                className="rounded-full h-24 w-24"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Buyer Name</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.name_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Product</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.product_name}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Quantity</td>
                  <td className="border px-4 py-2">{selectedOrder.quantity}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Total Price</td>
                  <td className="border px-4 py-2">{selectedOrder.price}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Phone number buyer
                  </td>
                  <td className="border px-4 py-2">
                    {selectedOrder.phone_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Address</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.address_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Note</td>
                  <td className="border px-4 py-2">{selectedOrder.note}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button className="bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
