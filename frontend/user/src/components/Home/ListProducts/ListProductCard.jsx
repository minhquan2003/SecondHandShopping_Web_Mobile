import React from "react";
import ProductCard from "./ProductCard";

const ListProductCard = ({ data }) => {
    const { products, loading, error } = data;
    // alert("ba " + JSON.stringify(products))

    return (
        <div className="flex flex-col bg-white items-center rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="inline-block relative w-20 h-20 animate-spin">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-gray-500 rounded-full"></div>
                    </div>
                    <span className="ml-4 text-gray-500">Loading products...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 font-bold">Error: {error}</div>
            ) : (
                <div className="mt-2 mb-2 bg-white justify-center items-center">
                    <div className="flex flex-wrap justify-start items-center" style={{ width: '1225px'}}>
                        {Array.isArray(products) && products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                quantity={product.quantity}
                                image_url={product.image_url}
                                partner={product.partner}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListProductCard;