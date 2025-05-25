import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByIdSeller } from '../../hooks/Products';
import BackButton from '../../commons/BackButton';
import { useUserById } from '../../hooks/Users';
import { FaCheckCircle } from 'react-icons/fa';
import nonAvata from '../../assets/img/nonAvata.jpg';


const ProductCard1 = ({ id, name, description, price, quantity, media_url, partner }) => {
    const isVideo = media_url?.toLowerCase().endsWith('.mp4') || media_url?.toLowerCase().endsWith('.mov') || media_url?.toLowerCase().endsWith('.webm');
    // const isImage = media_url?.toLowerCase().endsWith('.jpg') || media_url?.toLowerCase().endsWith('.jpeg') || media_url?.toLowerCase().endsWith('.png') || media_url?.toLowerCase().endsWith('.gif');

    return (
        <Link to={`/product/${id}`} className="flex mt-2 mb-2 justify-center items-center hover:bg-gray-200 rounded-lg" style={{ width: '225px', height: '350px', textDecoration: 'none' }}>
            <div className="bg-white h-full w-[95%] border rounded-lg shadow-md p-2 m-2 transition-shadow duration-300">
                <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
                    {isVideo ? (
                            <video controls className="object-cover w-full h-full">
                                <source src={media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img 
                                src={media_url} 
                                alt={name} 
                                className="object-cover" 
                                style={{ width: '250px', height: '200px' }} 
                            />
                        )}
                </div>
                <div className="w-full h-[45%] p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{name}</h2>
                    {partner && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Đảm bảo chất lượng
                        </p>
                    )}
                    <p className="text-gray-500"> {media_url}</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">{price?.toLocaleString('vi-VN')} VNĐ</p>
                    <p className="text-gray-500">Số lượng: {quantity}</p>
                </div>
            </div>
        </Link>
    );
};

const SellerPage = () => {
    const { sellerId } = useParams();
    const { products, error } = getProductsByIdSeller(sellerId); // Loại bỏ loading
    const { sellerInfo, error: sellerError } = useUserById(sellerId); // Loại bỏ loading

    if (error || sellerError) {
        return <div className="text-red-500 font-bold text-center">Error: {error || sellerError}</div>;
    }

    if (!Array.isArray(products) || !sellerInfo) {
        return <div className="text-red-500 font-bold text-center">Invalid data</div>;
    }

    return (
        <div className="p-5 min-h-screen">
            <BackButton />
            <div className="flex mt-4">
                <div className="w-1/4 p-4 border flex flex-col justify-center items-center">
                    <div className="w-full h-48 overflow-hidden mt-4 flex flex-col justify-center items-center">
                        <img src={sellerInfo.avatar_url || nonAvata} alt="Avatar" className="w-32 h-32 rounded-full object-cover" />
                        <h2 className="text-xl font-semibold mt-4 text-center">{sellerInfo.name}</h2>
                    </div>
                    <div className="ml-4">
                        <p className="mt-2">Số điện thoại: {sellerInfo.phone}</p>
                        <p className="mt-2">Địa chỉ: {sellerInfo.address}</p>
                        <p className="mt-2">Email: {sellerInfo.email}</p>
                    </div>
                </div>
                <div className="w-3/4 p-4">
                    <div className="flex flex-wrap justify-start items-center">
                        {products.map((product) => (
                            <ProductCard1
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                quantity={product.quantity}
                                media_url={product.image_url || product.video_url}
                                partner={product.partner}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPage;