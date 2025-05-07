import { useState } from "react";
import useProducts from "../../hooks/useProduct";
import { IoClose } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const ProductRequest = () => {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const {
    products = [],
    loading,
    error,
    totalPages,
    approveProducts,
    deleteSelectedProducts,
  } = useProducts("request", page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleApprove = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (window.confirm("Are you sure you want to approve selected products")) {
      approveProducts(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected products?")) {
      deleteSelectedProducts(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleSelectOne = (productId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id != productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(products.map((product) => product._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value == "deleteProducts") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
            if (e.target.value == "approveProducts") {
              handleApprove();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="approveProducts">Approve selected products</option>
          <option value="deleteProducts">Delete selected products</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className=" text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by username..."
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
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    products.length > 0 &&
                    selectedCheckBox.length === products.length
                  }
                />
              </th>
              <th className="text-sm border px-4 py-2 text-center whitespace-nowrap">
                Image
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Name <FaSort onClick={() => handleSort("name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Category{" "}
                  <FaSort onClick={() => handleSort("category_name")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Price <FaSort onClick={() => handleSort("price")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Quantity <FaSort onClick={() => handleSort("quantity")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Posted By <FaSort onClick={() => handleSort("username")} />
                </span>
              </th>
              <th className="text-sm border px-4 py-2 text-center whitespace-nowrap">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(product._id)}
                      onChange={() => handleSelectOne(product._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="border px-4 py-2 text-sm ">{product.name}</td>
                  <td className="border px-4 py-2 text-sm ">
                    {product.category_name}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {product.price.toLocaleString()} VND
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {product.quantity}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {product.username}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No products available.
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
          Previous
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <p>
              <strong>Name:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category_name}
            </p>
            <p>
              <strong>Price:</strong> {selectedProduct.price.toLocaleString()}{" "}
              VND
            </p>
            <p>
              <strong>Quantity:</strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Posted By:</strong> {selectedProduct.username}
            </p>
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-20 h-auto rounded mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRequest;
