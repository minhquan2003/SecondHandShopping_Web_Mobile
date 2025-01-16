import { useState, useEffect } from "react";
import axios from "axios";

const getProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5555/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};

const getProductsByIdSeller = (idSeller) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products/user/${idSeller}`);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Không có sản phẩm nào.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};

const getProductsNotApproveByIdSeller = (idSeller) => {
    const [productsnotapprove, setProducts] = useState([]);
    const [loadingnotapprove, setLoading] = useState(true);
    const [errornotapprove, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products/notapprove/user/${idSeller}`);
                setProducts(response.data);
            } catch (err) {
                setError("Không có sản phẩm nào.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { productsnotapprove, loadingnotapprove, errornotapprove };
};

const getProductsSoldOutByIdSeller = (idSeller) => {
    const [productsSoldOut, setProducts] = useState([]);
    const [loadingSoldOut, setLoading] = useState(true);
    const [errorSoldOut, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products/soldout/user/${idSeller}`);
                setProducts(response.data);
            } catch (err) {
                setError("Không có sản phẩm nào.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { productsSoldOut, loadingSoldOut, errorSoldOut };
};

const useProduct = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                const response = await axios.get(`http://localhost:5555/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("FKhông có sản phẩm nào.");
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
};

const updateProduct = async ({id, quanlity}) => {
    try {
        const response = await axios.put(`http://localhost:5555/products/quanlity`, {id, quanlity});
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error update product:', error);
        throw error;
    }
};

const updateOneProduct = async (id, product) => {
    try {
        const response = await axios.put(`http://localhost:5555/products/${id}`, product);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error update product:', error);
        throw error;
    }
};

const addProduct = async (product) => {
    try {
        const response = await axios.post(`http://localhost:5555/products`, product);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error add product:', error);
        throw error;
    }
};

const getProductByCategory = (id) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products/category/${id}`);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Không có sản phẩm nào.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};

const getProductById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5555/products/${id}`);
        const product = response.data
        return product; // Trả về sản phẩm
    } catch (err) {
        console.error("Error fetching product:", err);
        throw new Error("Không có sản phẩm nào.");
    }
};

const deleteProductById = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:5555/products/${id}`);
        const product = response.data
        return product; // Trả về sản phẩm
    } catch (err) {
        console.error("Error delete product:", err);
        throw new Error("Không có sản phẩm nào.");
    }
};

const getProductByName = (product) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching products for:", product); // Ghi nhận giá trị của product
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/products/search`, { params: { name: product } });
                setProducts(response.data.data); // Đảm bảo rằng response.data.data là chính xác
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Không có sản phẩm nào.");
            } finally {
                setLoading(false);
            }
        };

        if (product) { // Chỉ gọi fetchProducts nếu product không rỗng
            fetchProducts();
        }
    }, [product]); // Thêm product vào dependency array

    console.log("Products:", products); // Ghi nhận sản phẩm đã lấy
    return { products, loading, error };
};

const useSearchProducts = (brand, categoryId) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Tạo URL tìm kiếm với query parameters
                const response = await axios.get('http://localhost:5555/products/product/search', {
                    params: {
                        brand,
                        category_id: categoryId
                    }
                });
                setProducts(response.data.data); // Lưu trữ danh sách sản phẩm
            } catch (err) {
                setError(err.response.data.message || 'Something went wrong'); // Xử lý lỗi
            } finally {
                setLoading(false);
            }
        };

        // Gọi hàm tìm kiếm nếu có ít nhất một tham số
        if (brand || categoryId) {
            fetchProducts();
        } else {
            setProducts([]); // Nếu không có tham số, xóa danh sách sản phẩm
        }
    }, [brand, categoryId]); // Chạy lại khi brand hoặc categoryId thay đổi

    return { products, loading, error };
};

export {useSearchProducts, 
    getProducts, 
    deleteProductById, 
    getProductById, 
    useProduct, 
    updateProduct, 
    getProductByCategory, 
    addProduct, 
    getProductByName, 
    getProductsByIdSeller,
    getProductsNotApproveByIdSeller,
    getProductsSoldOutByIdSeller,
    updateOneProduct};