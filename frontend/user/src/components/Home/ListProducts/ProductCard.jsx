import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const ProductCard = ({ id, name, description, price, quantity, image_url, partner }) => {
    return (
        <Link to={`/product/${id}`} className="flex mt-2 mb-2 justify-center items-center hover:bg-gray-200 rounded-lg" style={{ width: '245px', height: '350px', textDecoration: 'none' }}>
            <div className="bg-white h-full w-[95%] border rounded-lg shadow-md p-2 m-2 transition-shadow duration-300">
                <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
                    <img 
                        src={image_url} 
                        alt={name} 
                        className="object-cover" 
                        style={{ width: '245px', height: '200px' }}
                    />
                </div>
                <div className="w-full h-[45%] p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{name}</h2>
                    {/* {String(partner) === "true" ? (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Đảm bảo chất lượng
                        </p>
                    ) : null} */}
                    <p className="text-lg font-bold text-red-500 mt-2">{price.toLocaleString('vi-VN')} VNĐ</p>
                    <p className="text-gray-500">Số lượng: {quantity}</p>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image_url: PropTypes.string.isRequired,
    partner: PropTypes.bool.isRequired,
};

export default ProductCard;