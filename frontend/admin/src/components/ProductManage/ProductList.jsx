import React, { useState } from "react";
import useProducts from "../../hooks/useProduct";
import { IoClose } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { TbListDetails } from "react-icons/tb";
import { BiHide } from "react-icons/bi";

const ProductList = () => {
  const { products, loading, error, hideProduct, deleteProduct } =
    useProducts("approved"); // Get pending products
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of products per page

  // Calculate total pages and current products
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHide = (productId) => {
    if (window.confirm("Are you sure you want to hide this product?")) {
      hideProduct(productId);
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
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

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        PRODUCT LIST
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-lg">No products available.</div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Image
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Name
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Category
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Price
                </th>
                <th className="text-sm px-2 py-2 text-center font-bold text-gray-600 border">
                  Quantity
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Description
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Posted By
                </th>
                <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.category_name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.price.toLocaleString()} VND
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.quantity}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.description.split(" ").slice(0, 10).join(" ")}...
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.username}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleHide(product._id)}
                        className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      >
                        <BiHide />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        <GiCancel />
                      </button>
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        <TbListDetails />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          {products.length > itemsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

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

export default ProductList;
