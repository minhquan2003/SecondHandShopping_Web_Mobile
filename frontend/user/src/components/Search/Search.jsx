import { getProductByName, getAllCountries } from '../../hooks/Products';
import { useSearchParams } from 'react-router-dom';
import ListProductCard from '../Home/ListProducts/ListProductCard';
import React, { useState, useEffect } from 'react';

const ProductByName = () => {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const { products, loading, error } = getProductByName(name);
    const [countries, setCountries] = useState([]);
    const data = products || [];
    const [brand, setBrand] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(999);
    const [origin, setOrigin] = useState('');
    const [condition, setCondition] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(data);
    const [minUnit, setMinUnit] = useState('thousand');
    const [maxUnit, setMaxUnit] = useState('million');

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const countriesData = await getAllCountries();
                setCountries(countriesData); // Cập nhật danh sách quốc gia
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        loadCountries();
    }, []);

    useEffect(() => {
        setFilteredProducts(data);
    }, [data]);

    const handleFilter = () => {
        const minMultiplier = minUnit === 'million' ? 1000000 : 1000;
        const maxMultiplier = maxUnit === 'million' ? 1000000 : 1000;

        const newFilteredProducts = data.filter((product) => {
            const isInPriceRange =
                product.price >= (minPrice * minMultiplier) && product.price <= (maxPrice * maxMultiplier);
            const isInBrand = brand ? product.brand.toLowerCase().includes(brand.toLowerCase()) : true;
            const isInOrigin = origin ? product.origin.toLowerCase().includes(origin.toLowerCase()) : true;
            const isInCondition = condition ? product.condition === condition : true;

            return isInPriceRange && isInBrand && isInOrigin && isInCondition;
        });
        setFilteredProducts(newFilteredProducts);
    };

    const handleResetFilters = () => {
        setBrand('');
        setMinPrice(0);
        setMaxPrice(999);
        setOrigin('');
        setCondition('');
        setMinUnit('thousand');
        setMaxUnit('million');
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
                            min="0"
                            max="999"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={minUnit}
                            onChange={(e) => setMinUnit(e.target.value)}
                            className="border border-gray-300 p-2 w-full mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="thousand">Nghìn đồng</option>
                            <option value="million">Triệu đồng</option>
                        </select>
                        <input
                            type="range"
                            min="0"
                            max="999"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium" htmlFor="maxPriceInput">Giá tối đa:</label>
                        <input
                            id="maxPriceInput"
                            type="number"
                            min="0"
                            max="999"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={maxUnit}
                            onChange={(e) => setMaxUnit(e.target.value)}
                            className="border border-gray-300 p-2 w-full mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="thousand">Nghìn đồng</option>
                            <option value="million">Triệu đồng</option>
                        </select>
                        <input
                            type="range"
                            min="0"
                            max="999"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full mt-2"
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
                        <select
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="border border-gray-300 p-2 w-full mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Chọn xuất xứ</option>
                            {countries.length > 0 ? (
                                countries.map((country) => (
                                    <option key={country._id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Không có quốc gia nào</option>
                            )}
                        </select>
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