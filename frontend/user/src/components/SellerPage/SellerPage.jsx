import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByIdSeller } from '../../hooks/Products'; // Giả sử bạn đã có hook này
import BackButton from '../../commons/BackButton';
import { useUserById } from '../../hooks/Users';
import { FaCheckCircle } from 'react-icons/fa';
import nonAvata from '../../assets/img/nonAvata.jpg'

const ProductCard1 = ({ id, name, description, price, quantity, image_url, partner }) => {
    return (
        <Link to={`/product/${id}`} className="flex mt-2 mb-2 justify-center items-center hover:bg-gray-200" style={{ width: '225px', height: '350px', textDecoration: 'none' }}>
            <div className="bg-white h-full w-[95%] border rounded-lg shadow-md p-2 m-2 transition-shadow duration-300">
                <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
                    <img 
                        src={image_url} 
                        alt={name} 
                        className="object-cover" 
                        style={{ width: '225px', height: '200px' }} // Thiết lập kích thước cố định cho ảnh
                    />
                </div>
                <div className="w-full h-[45%] p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                    {String(partner) === "true" ? (  // So sánh partner với chuỗi "true"
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <FaCheckCircle className="mr-1" /> {/* Biểu tượng check */}
                            Đảm bảo chất lượng
                        </p>
                    ) : null}
                    <p className="text-lg font-bold text-gray-800 mt-2">{price.toLocaleString('vi-VN')} VNĐ</p>
                    <p className="text-gray-500">Số lượng: {quantity}</p>
                </div>
            </div>
        </Link>
    );
};

const SellerPage = () => {
    const { sellerId } = useParams();
    const { products, loading, error } = getProductsByIdSeller(sellerId);
    const sellerInfo = useUserById(sellerId);

    return (
        <div className="p-5 h-min-screen min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
        <div className="flex">
            <div className="w-1/4 p-4 border flex flex-col justify-center items-center">
                <div className="w-full h-45 overflow-hidden mt-4 flex flex-col justify-center items-center">
                    {sellerInfo.avatar_url ? (
                    <img src={sellerInfo.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full" />
                    ) : (
                        <img src={nonAvata} alt="Avatar" className="w-32 h-32 object-cover rounded-full" />
                    )}
                    <h2 className="text-xl font-semibold mt-4 text-center">{sellerInfo.name}</h2>
                </div>
                <div>
                    <p className="mt-2 ml-4">Số điện thoại: {sellerInfo.phone}</p>
                    <p className="mt-2 ml-4">Địa chỉ: {sellerInfo.address}</p>
                    <p className="mt-2 ml-4">Email: {sellerInfo.email}</p>
                </div>
            </div>
                <div className="w-3/4 p-4">
                    <div className="w-full h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
                        <div className="mt-2 mb-2 bg-white justify-center items-center">
                            <div className="flex flex-wrap justify-start items-center">
                                {Array.isArray(products) && products.map((product) => (
                                    <ProductCard1
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPage;