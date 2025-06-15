import { useState } from "react";
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
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        {/* <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteRolePartners">
            Delete selected role partners
          </option>
        </select> */}
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Tìm kiếm theo tên người mua..."
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
                <span className="text-sm inline-flex items-center gap-x-2">
                  Người mua <FaSort onClick={() => handleSort("name_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Sản phẩm <FaSort onClick={() => handleSort("product_name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Số lượng <FaSort onClick={() => handleSort("quantity")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Tổng tiền <FaSort onClick={() => handleSort("price")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Điện thoại{" "}
                  <FaSort onClick={() => handleSort("phone_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Địa chỉ <FaSort onClick={() => handleSort("address_buyer")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Trạng thái đơn hàng{" "}
                  <FaSort onClick={() => handleSort("status_order")} />
                </span>
              </th>
              <th className="text-sm border px-2 py-2 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border">
                  <td className="border px-4 py-2 text-sm ">
                    {order.name_buyer}
                  </td>
                  <td className="border px-2 py-2 text-sm ">
                    {order.product_name}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {order.quantity}
                  </td>
                  <td className="border px-4 py-2 text-sm ">{order.price}</td>
                  <td className="border px-4 py-2 text-sm ">
                    {order.phone_buyer}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {order.address_buyer}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
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
                  Không có đơn hàng.
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
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Trang {page} của {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </div>

      {isPopupOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Chi tiết đơn hàng</h2>

            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Người mua</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.name_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Sản phẩm</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.product_name}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Số lượng</td>
                  <td className="border px-4 py-2">{selectedOrder.quantity}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Tổng tiền</td>
                  <td className="border px-4 py-2">{selectedOrder.price}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">SĐT người mua</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.phone_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Địa chỉ</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.address_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Trạng thái đơn hàng
                  </td>
                  <td className="border px-4 py-2">
                    {selectedOrder.status_order}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Loại giao hàng</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.shipping_method}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Ghi chú</td>
                  <td className="border px-4 py-2">{selectedOrder.note}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={closePopup}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
