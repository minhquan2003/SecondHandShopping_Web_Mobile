import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { getProductById } from '../../hooks/Products';
import { addReview } from '../../hooks/Review';
import { updateStatusOrder } from '../../hooks/Orders';
import { createNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';

const socket = io('http://localhost:5555');

const PurchaseOrder = () => {
    const { orderId } = useParams(); // Lấy mã đơn hàng từ URL
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [cancelText, setCancelText] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(rating == 0 || !comment){
            alert("Hãy điền đủ thông tin đánh giá!")
            return
        }
        addReview({
            product_id: product._id,
            user_id: order.user_id_buyer,
            rating: rating,
            comment: comment
        })
        alert(`Bạn đã đánh giá cho sản phẩm ${product.name}.`);
        setRating(0);
        setComment('');
        navigate(`/order/${orderId}`)
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        if (!cancelText || !cancelText.trim()) {
            alert(`Hãy nhập nguyên nhân muốn huỷ đơn hàng!`);
            return;
        }
        const status_order = 'Request Cancel';
        alert(`Đơn hàng đang được chờ xác nhận huỷ.`);
        
        try {
            await updateStatusOrder(orderId, status_order);
            
            await createNotification({
                user_id_created: order.user_id_buyer,
                user_id_receive: seller._id,
                message: `Đơn hàng ${product.name} của ${userInfo.name} đã muốn huỷ do: ${cancelText}.`
            });
            socket.emit('sendNotification');
            
            navigate(`/order/${order._id}`);
        } catch (error) {
            console.error("Có lỗi xảy ra khi huỷ đơn hàng:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Lấy thông tin đơn hàng
                const orderResponse = await axios.get(`http://localhost:5555/orders/${orderId}`);
                setOrder(orderResponse.data.data);

                const sellerResponse = await axios.get(`http://localhost:5555/users/${orderResponse.data.data.user_id_seller}`);
                setSeller(sellerResponse.data);

                const paymentRe = await axios.get(`http://localhost:5555/payments/order/${orderId}`);
                setPayment(paymentRe.data.data);

                // Lấy thông tin chi tiết đơn hàng
                const detailsResponse = await axios.get(`http://localhost:5555/orderDetails/order/${orderId}`);
                const detailsData = detailsResponse.data.data;

                // Nếu có dữ liệu, lấy sản phẩm đầu tiên
                if (detailsData.length > 0) {
                    
                    setOrderDetails(detailsData[0]); // Lưu đối tượng đầu tiên
                    const idPro = detailsData[0].product_id
                    const product1 = await getProductById(idPro)
                    setProduct(product1)
                }
                
            } catch (error) {
                console.error('Error fetching order data:', error);
                setError('Không thể tải thông tin đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if (loading) {
        return <p>Đang tải thông tin đơn hàng...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!order) {
        return <p>Không tìm thấy thông tin đơn hàng.</p>;
    }

    return (
        <div className="p-5 bg-gray-100">
            <div className="flex items-center mb-4">
                <BackButton />
                {/* <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1> */}
            </div>
            <div className="w-full flex flex-col items-center mb-10">
                <h1 className="text-2xl font-bold mb-4">Thông tin đơn hàng</h1>
                <div className="flex bg-white rounded-lg shadow-md w-4/5">
                    <div className="bg-white h-full w-4/6 flex rounded-lg shadow-md p-6">
                        <div className="bg-white w-2/5 rounded-lg p-6 flex flex-col items-center">
                            <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-md mb-4" />
                            <p><strong></strong>Số lượng:{" " + orderDetails.quantity}</p>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold">Đơn mua</h2>
                            <p className="text-xl text-green-600"><strong></strong> {product.name}</p>
                            <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> {order.address}</p>
                            <p><strong>Tổng số tiền:</strong> {order.total_amount.toLocaleString()} VNĐ</p>
                            <p><strong>Trạng thái đơn hàng:</strong> {order.status_order}</p>
                            <p><strong>Ghi chú:</strong> {order.note ? order.note : "Không có"}</p>
                            <p><strong>Ngày tạo đơn:</strong> {formatDate(order.createdAt)}</p>
                            {payment[0] ? 
                            <>
                            <p><strong>Trạng thái thanh toán:</strong> {payment[0].status_payment}</p>
                            <p><strong>Ngày thanh toán:</strong> {formatDate(payment[0].createdAt)}</p>
                            </> :
                            <p><strong>Trạng thái thanh toán:</strong> Thanh toán khi nhận hàng</p>
                            }
                            <h3 className="text-xl font-semibold mt-4">Thông tin người bán</h3>
                            <p><strong>Tên người bán:</strong> {seller.name}</p>
                            <p><strong>Số điện thoại:</strong> {seller.phone}</p>
                            <p><strong>Địa chỉ:</strong> {seller.address}</p>
                            <button 
                                className="bg-gray-100 mt-2 border border-blue-500 text-blue-600 underline rounded p-2 hover:bg-gray-300 transition duration-300"
                                onClick={() => navigate(`/seller/${product.user_id}`)}
                            >
                                Xem trang người bán
                            </button>
                        </div>
                    </div>
                    <div className="w-2/6 flex flex-col justify-center">
                        <div className="bg-white w-full h-full rounded-lg p-6">
                        {order && (order.status_order == 'Pending' || order.status_order == 'Confirmed') ?
                            (<div>
                                <div className="mb-2 w-full mt-5">
                                        <textarea 
                                            type="text" 
                                            placeholder="Nguyên nhân muốn huỷ đơn hàng" 
                                            value={cancelText} 
                                            onChange={(e) => setCancelText(e.target.value)} 
                                            className="border border-gray-300 p-2 w-full rounded"
                                            rows="3"
                                            required
                                        />
                                    </div>                      
                                    <div>
                                        <button 
                                            onClick={handleCancel} 
                                            className="bg-gray-100 text-red-600 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition duration-200"
                                        >
                                            Huỷ đơn hàng
                                        </button>
                                    </div>
                            </div>)
                        : order.status_order == 'Success' ?
                            (<div>
                                <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2>
                            <form onSubmit={handleSubmit} className="py-4">
                                <div className="mb-2">
                                    {/* <label className="block mb-1">Đánh giá:</label> */}
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                onClick={() => setRating(star)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1" htmlFor="comment">Nhận xét:</label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="border rounded p-2 w-full"
                                        rows="4"
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
                                    Gửi đánh giá
                                </button>
                            </form>
                            </div>) : null
                        }
                            
                        </div>
                    </div>
            </div>
            </div>
        </div>
    );
};

export default PurchaseOrder;