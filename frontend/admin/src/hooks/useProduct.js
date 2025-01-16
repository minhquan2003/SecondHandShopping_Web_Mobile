import { useState, useEffect } from "react";

const useProducts = (type) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      let url = "";
      if (type === "request") {
        url = "http://localhost:5555/admin/pending-products"; // Fetch pending products
      } else if (type === "approved") {
        url = "http://localhost:5555/admin/products"; // Fetch approved products
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          const filteredProducts = data.data.filter(
            (product) =>
              product.status === true &&
              product.approve === (type === "approved" ? true : false)
          );

          setProducts(filteredProducts);
        } else {
          setError("Failed to load products.");
        }
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  const approveProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5555/admin/approve-product/${productId}`, {
        method: "PUT",
      });
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      alert("Product approved!");
    } catch {
      alert("Failed to approve the product.");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5555/admin/delete-product/${productId}`, {
        method: "DELETE",
      });
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      alert("Product denied and removed!");
    } catch {
      alert("Failed to deny the product.");
    }
  };

  const hideProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5555/admin/hide-product/${productId}`, {
        method: "PUT",
      });
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      alert("Product hidden!");
    } catch {
      alert("Failed to hide the product.");
    }
  };

  return {
    products,
    loading,
    error,
    approveProduct,
    deleteProduct,
    hideProduct,
  };
};

export default useProducts;
