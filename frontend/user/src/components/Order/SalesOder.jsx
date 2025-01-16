import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { getProductById } from '../../hooks/Products';
import { updateStatusOrder } from '../../hooks/Orders';
import { createNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';

const socket = io('http://localhost:5555'); // Đảm bảo cổng đúng

const SalesOrder = () => {
    const { orderId } = useParams();
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [product, setProduct] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelText, setCancelText] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderResponse = await axios.get(`http://localhost:5555/orders/${orderId}`);
                setOrder(orderResponse.data.data);

                const paymentRe = await axios.get(`http://localhost:5555/payments/order/${orderId}`);
                setPayment(paymentRe.data.data);

                const detailsResponse = await axios.get(`http://localhost:5555/orderDetails/order/${orderId}`);
                const detailsData = detailsResponse.data.data;

                if (detailsData.length > 0) {
                    setOrderDetails(detailsData[0]);
                    const productData = await getProductById(detailsData[0].product_id);
                    setProduct(productData);
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

    const handleCancel = async (e) => {
        e.preventDefault();
        if (!cancelText) {
            alert(`Hãy nhập nguyên nhân huỷ đơn hàng!`);
            return;
        }
        const status_order = "Cancelled";
        alert(`Đơn hàng đã được chuyển sang ${status_order}.`);

        await updateStatusOrder(orderId, status_order);
        if (order.user_id_buyer) {
            const notification = await createNotification({
                user_id_created: userInfo._id,
                user_id_receive: order.user_id_buyer,
                message: `Đơn hàng ${product.name} của bạn đã bị huỷ do: ${cancelText}.`
            });
            socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
        }
        navigate(`/order/${orderId}`);
    };

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        let status_order = "";

        if (order.status_order === 'Pending') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được xác nhận thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Confirmed';
        } else if (order.status_order === 'Confirmed') {
            status_order = 'Packaged';
        } else if (order.status_order === 'Packaged') {
            status_order = 'Shipping';
        } else if (order.status_order === 'Request Cancel') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được xác nhận huỷ thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Cancelled';
        } else if (order.status_order === 'Shipping') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được giao thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Success';
        }

        alert(`Đơn hàng đã được chuyển sang ${status_order}.`);
        await updateStatusOrder(orderId, status_order);
        navigate(`/order/${orderId}`);
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
            </div>
            <div className="w-full flex flex-col items-center mb-10">
                <h1 className="text-2xl font-bold">Thông tin đơn hàng</h1>
                <div className="flex bg-white rounded-lg shadow-md w-4/5">
                    <div className="bg-white h-full w-4/6 flex rounded-lg shadow-md p-6">
                        <div className="bg-white w-2/5 rounded-lg p-6 flex flex-col items-center">
                            <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-md mb-4" />
                            <p><strong>Số lượng:</strong> {orderDetails.quantity}</p>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold">Đơn bán</h2>
                            <p className="text-xl text-blue-600"><strong>{product.name}</strong></p>
                            <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                            <p><strong>Người mua:</strong> {order.name}</p>
                            <p><strong>Số điện thoại:</strong> {order.phone}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> {order.address}</p>
                            <p><strong>Tổng số tiền:</strong> {order.total_amount.toLocaleString()} VNĐ</p>
                            <p><strong>Trạng thái đơn hàng:</strong> <span className="text-red-500 font-bold">{order.status_order}</span></p>
                            <p><strong>Ghi chú:</strong> {order.note || "Không có"}</p>
                            <p><strong>Ngày tạo đơn:</strong> {formatDate(order.createdAt)}</p>
                            {payment[0] ? (
                                <>
                                    <p><strong>Trạng thái thanh toán:</strong> {payment[0].status_payment}</p>
                                    <p><strong>Ngày thanh toán:</strong> {formatDate(payment[0].createdAt)}</p>
                                </>
                            ) : (
                                <p><strong>Trạng thái thanh toán:</strong> Thanh toán khi nhận hàng</p>
                            )}
                        </div>
                    </div>
                    <div className="w-2/6 flex flex-col justify-center">
                        <div className="bg-white w-full h-full rounded-lg p-6">
                            {(order.status_order === 'Pending' || order.status_order === 'Shipping' ||
                            order.status_order === 'Packaged' || order.status_order === 'Confirmed') ? (
                                <div className="bg-white rounded-lg mt-4">
                                    <h2 className="text-xl font-semibold">Cập nhật đơn hàng</h2>
                                    <div>
                                        <button 
                                            onClick={handleChangeStatus} 
                                            className="bg-gray-100 text-green-600 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition duration-200"
                                        >
                                            Xác nhận đơn hàng
                                        </button>
                                    </div>
                                    <div className="mb-2 w-full mt-5">
                                        <textarea 
                                            type="text" 
                                            placeholder="Nguyên nhân huỷ đơn hàng" 
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
                                </div>
                            ) : order.status_order === 'Success' ? null :
                            order.status_order === 'Request Cancel' ? (
                                <button 
                                    onClick={handleChangeStatus} 
                                    className="bg-green-400 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-500 transition duration-200"
                                >
                                    Xác nhận huỷ
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrder;