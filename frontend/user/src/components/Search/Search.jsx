import { getProductByName } from '../../hooks/Products';
import { useSearchParams } from 'react-router-dom';
import ListProductCard from '../Home/ListProducts/ListProductCard';
import { getCategories } from '../../hooks/Categories';
import React, { useState, useEffect } from 'react';

const ProductByName = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const { products, loading, error } = getProductByName(name);
    const data = products || [];
    const [brand, setBrand] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [origin, setOrigin] = useState('');
    const [condition, setCondition] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(data);
    const { categories } = getCategories();

    useEffect(() => {
        setFilteredProducts(data);
    }, [data]);

    const handleFilter = () => {
        const newFilteredProducts = data.filter((product) => {
            const isInPriceRange =
                (minPrice === '' || product.price >= Number(minPrice)) &&
                (maxPrice === '' || product.price <= Number(maxPrice));
            const isInBrand = brand ? product.brand.toLowerCase().includes(brand.toLowerCase()) : true;
            const isInOrigin = origin ? product.origin.toLowerCase().includes(origin.toLowerCase()) : true;
            const isInCondition = condition ? product.condition === condition : true;

            return isInPriceRange && isInBrand && isInOrigin && isInCondition;
        });
        setFilteredProducts(newFilteredProducts);
    };

    const handleResetFilters = () => {
        setBrand('');
        setMinPrice('');
        setMaxPrice('');
        setOrigin('');
        setCondition('');
        setFilteredProducts(data);
    };

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <div className="mb-6 bg-white shadow rounded-lg p-4 flex flex-col">
                <div className="text-lg font-semibold text-gray-800">
                    Bạn đang tìm kiếm cho từ khoá: 
                    <span className="text-xl font-bold text-red-600 ml-1">{name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="brandInput">Thương hiệu:</label>
                        <input
                            id="brandInput"
                            type="text"
                            placeholder="Nhập thương hiệu"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="minPriceInput">Giá tối thiểu:</label>
                        <input
                            id="minPriceInput"
                            type="number"
                            placeholder="Giá tối thiểu"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="maxPriceInput">Giá tối đa:</label>
                        <input
                            id="maxPriceInput"
                            type="number"
                            placeholder="Giá tối đa"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="originInput">Xuất xứ:</label>
                        <input
                            id="originInput"
                            type="text"
                            placeholder="Nhập xuất xứ"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="conditionSelect">Tình trạng:</label>
                        <select
                            id="conditionSelect"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Tất cả</option>
                            <option value="Mới">Mới</option>
                            <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                            <option value="Tái chế">Tái chế</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleFilter}
                            className="mt-4 border border-gray-300 bg-gray-100 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                        >
                            Tìm Kiếm
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="mt-4 border border-gray-300 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 ml-2"
                        >
                            Bỏ Tìm
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="w-full flex flex-col justify-center items-center bg-main overflow-x-hidden mt-6">
                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : error ? (
                    <p>Có lỗi xảy ra: {error.message}</p>
                ) : filteredProducts.length > 0 ? (
                    <ListProductCard data={{ products: filteredProducts, loading, error }} />
                ) : (
                    <p className="text-red-500">Không tìm thấy sản phẩm mong muốn.</p>
                )}
            </div>
        </div>
    );
}

export default ProductByName;