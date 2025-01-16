import Products from "../../../User/models/Products.js";
import Categories from "../../../User/models/Categories.js";
import Users from "../../../User/models/Users.js";

// Chuyển trạng thái status thành true
const updateProductApproveToTrue = async (productId) => {
  try {
    const product = await Products.findByIdAndUpdate(
      productId,
      { approve: true }, // Update the approve field to true
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    throw new Error(
      "Error updating product approve status to true: " + error.message
    );
  }
};

// Chuyển trạng thái status thành false
const updateProductApproveToFalse = async (productId) => {
  try {
    const product = await Products.findByIdAndUpdate(
      productId,
      { approve: false }, // Update the approve field to false
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    throw new Error(
      "Error updating product approve status to false: " + error.message
    );
  }
};

// Xóa sản phẩm theo ID
const deleteProduct = async (productId) => {
  try {
    // Update the product's status to false
    const product = await Products.findByIdAndUpdate(
      productId,
      { status: false }, // Set the status field to false
      { new: true } // Return the updated product document
    );

    if (!product) {
      throw new Error("Product not found or already deleted");
    }

    return product; // Return the updated product
  } catch (error) {
    throw new Error("Error updating product status: " + error.message);
  }
};

const getProducts = async () => {
  try {
    // Define the query for active and approved products
    const query = { status: true, approve: true };

    // Fetch all products without pagination
    const products = await Products.find(query).lean();

    // Populate additional details (Category and User)
    for (const product of products) {
      const category = await Categories.findById(product.category_id);
      const user = await Users.findById(product.user_id);

      // Add category name and username to the product
      product.category_name = category?.category_name || "Unknown";
      product.username = user?.name || "Unknown User";
    }

    // Count the total number of matching products
    const totalProducts = await Products.countDocuments(query);

    return {
      products,
      totalProducts, // Add the total count
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

// Lấy tất cả sản phẩm với approve = false (đang chờ duyệt)
const getRequestProducts = async () => {
  try {
    const query = { status: true, approve: false };

    // Fetch all pending products without pagination
    const products = await Products.find(query).lean();

    // Populate additional details (Category and User)
    for (const product of products) {
      const category = await Categories.findById(product.category_id);
      const user = await Users.findById(product.user_id);
      product.category_name = category?.category_name || "Unknown";
      product.username = user?.name || "Unknown User";
    }

    // Count the total number of matching pending products
    const totalProducts = await Products.countDocuments(query);

    return {
      products,
      totalProducts, // Add the total count
    };
  } catch (error) {
    throw new Error(
      "Error fetching pending approval products: " + error.message
    );
  }
};

export {
  updateProductApproveToTrue,
  getProducts,
  updateProductApproveToFalse,
  deleteProduct,
  getRequestProducts,
};
