// backend/controllers/productController.js
import {
    createProduct,
    getProducts,
    getOneProductById,
    getProductsByUserIdSoldOut,
    getProductsByCategory,
    getProductsByUserId,
    getProductsByUserIdNotApprove,
    searchProductsByName,
    searchProducts ,
    updateOneProduct,
    updateQuanlityProduct,
    deleteOneProduct
} from '../services/productService.js'; // Đảm bảo đường dẫn đúng

// Thêm sản phẩm
const addProduct = async (req, res) => {
    try {
        const product = await createProduct(req.body);
        return res.status(201).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await getProducts();
        return res.status(200).send(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await getOneProductById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getProductsByIdCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const product = await getProductsByCategory(categoryId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        const products = await getProductsByCategory(categoryId);
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getProductsByUserIdController = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params
    try {
        const products = await getProductsByUserId(userId);
        if (!products || products.length === 0) {
            return res.status(404).send({ message: 'No products found for this user' });
        }
        return res.status(200).send(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getProductsByUserIdSoldOutController = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params
    try {
        const products = await getProductsByUserIdSoldOut(userId);
        if (!products || products.length === 0) {
            return res.status(404).send({ message: 'No products found for this user' });
        }
        return res.status(200).send(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getProductsByUserIdNotApproveController = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params
    try {
        const products = await getProductsByUserIdNotApprove(userId);
        if (!products || products.length === 0) {
            return res.status(404).send({ message: 'No products found for this user' });
        }
        return res.status(200).send(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const searchProductsByNameController = async (req, res) => {
    try {
        const name = req.query.name; // Lấy tên sản phẩm từ query parameters
        if (!name) {
            return res.status(400).json({ success: false, message: "Product name is required." });
        }

        const products = await searchProductsByName(name);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const searchProductsController = async (req, res) => {
    try {
        const brand = req.body.brand; // Lấy brand từ query parameters
        const categoryId = req.body.category_id; // Lấy category_id từ query parameters

        const products = await searchProducts(brand, categoryId);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const product = await updateOneProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const updateQuanlity = async (req, res) => {
    try {
        const product = await updateQuanlityProduct(req.body.id, req.body.quanlity);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const product = await deleteOneProduct(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(204).send({message: 'Xoá thành công'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export { addProduct, 
    getAllProducts, 
    getProductById, 
    getProductsByIdCategory,
    getProductsByUserIdController,
    getProductsByUserIdSoldOutController,
    getProductsByUserIdNotApproveController,
    searchProductsByNameController,
    searchProductsController,
    updateProduct, 
    updateQuanlity,
    deleteProduct};