import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../../commons/BackButton';

const Order = () => {
    const [activeTab, setActiveTab] = useState('sell');
    const [sellOrders, setSellOrders] = useState([]);
    const [buyOrders, setBuyOrders] = useState([]);
    const [activeSellTab, setActiveSellTab] = useState('Pending');
    const [activeBuyStatus, setActiveBuyStatus] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPhone, setSearchPhone] = useState(''); // Thêm state cho tìm kiếm số điện thoại

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfoString = sessionStorage.getItem('userInfo');
                const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

                const sellResponse = await axios.get(`http://localhost:5555/orders/seller/${userInfo._id}`);
                setSellOrders(sellResponse.data.data);

                const buyResponse = await axios.get(`http://localhost:5555/orders/buyer/${userInfo._id}`);
                setBuyOrders(buyResponse.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const filteredSellOrders = sellOrders.filter(order => {
        const matchesStatus = order.status_order === activeSellTab;
        const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPhone = order.phone.includes(searchPhone); // Lọc theo số điện thoại
        return matchesStatus && matchesSearch && matchesPhone;
    });

    const filteredBuyOrders = buyOrders.filter(order => {
        const matchesSearch = activeBuyStatus === 'All' || order.status_order === activeBuyStatus;
        const matchesSearchTerm = order.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && matchesSearchTerm;
    });

    const sortOrders = (orders) => {
        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const filterByDateRange = (orders) => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (!startDate || orderDate >= start) && (!endDate || orderDate <= end);
        });
    };

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

    const filteredAndSortedSellOrders = sortOrders(filterByDateRange(filteredSellOrders));
    const filteredAndSortedBuyOrders = sortOrders(filteredBuyOrders);

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSortOrder('none');
        setSearchTerm('');
        setActiveBuyStatus('All');
        setSearchPhone(''); // Đặt lại số điện thoại tìm kiếm
    };

    return (
        <div className="min-h-screen p-5 bg-gray-100">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
            <div className="flex mb-4 w-full">
                <button 
                    className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'sell' ? 'text-blue-500 font-bold underline bg-blue-200' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('sell')}
                >
                    Đơn Bán
                </button>
                <button 
                    className={`flex-1 px-4 py-2 rounded-md ${activeTab === 'buy' ? 'text-blue-500 font-bold underline bg-blue-200' : 'bg-white text-black'}`} 
                    onClick={() => setActiveTab('buy')}
                >
                    Đơn Mua
                </button>
            </div>

            {activeTab === 'sell' && (
                <div>
                    <div className="text-xl font-bold">Tìm kiếm đơn hàng</div>
                    <div className="flex items-center mb-4 space-x-2">
                        <div className="text-xl font-semibold">Từ ngày:</div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="text-xl font-semibold">đến ngày:</div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Tìm theo tên người mua"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Tìm theo số điện thoại"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-2"
                        />
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="none">Không sắp xếp</option>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>
                        <button 
                            onClick={handleResetFilters}
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-2"
                        >
                            Hủy Lọc
                        </button>
                    </div>
                    <div className="flex mb-4 w-full">
                        {['Pending', 'Confirmed', 'Packaged', 'Shipping', 'Success', 'Request Cancel', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                className={`flex-1 px-4 py-2 text-black rounded-md ${activeSellTab === status ? 'text-blue-500 font-bold underline bg-blue-100' : 'bg-white text-black'}`}
                                onClick={() => setActiveSellTab(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {filteredAndSortedSellOrders.length === 0 ? (
                        <p>Không có đơn bán nào cho trạng thái này.</p>
                    ) : (
                        <ul className="bg-white h-[70vh] overflow-y-auto">
                            {filteredAndSortedSellOrders.map((order, index) => (
                                <Link to={`/salesOder/${order._id}`} key={order._id}>
                                    <li className="flex border-b p-4 hover:bg-gray-100 transition duration-200">
                                        <div className="text-gray-700">
                                             <span className="font-normal"> <strong>{index + 1}</strong> - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Họ tên:</strong> <span className="font-normal">{order.name} - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Tổng giá:</strong> <span className="font-normal">{order.total_amount.toLocaleString()} VNĐ - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Ngày tạo đơn hàng:</strong> <span className="font-normal">{formatDate(order.createdAt)} - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Số điện thoại người mua:</strong> <span className="font-normal">{order.phone} - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Trạng thái đơn hàng:</strong> <span className="font-normal text-red-500">{order.status_order}</span>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeTab === 'buy' && (
                <div>
                    <div className="text-xl font-bold">Tìm kiếm đơn hàng</div>
                    <div className="flex mb-4">
                        <select 
                            value={activeBuyStatus}
                            onChange={(e) => setActiveBuyStatus(e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-2"
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Pending">Chờ xử lý</option>
                            <option value="Confirmed">Đã xác nhận</option>
                            <option value="Packaged">Đang đóng gói</option>
                            <option value="Shipping">Đang vận chuyển</option>
                            <option value="Success">Thành công</option>
                            <option value="Request Cancel">Yêu cầu hủy</option>
                            <option value="Cancelled">Đã hủy</option>
                        </select>
                        <button 
                            onClick={handleResetFilters}
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                        >
                            Hủy Lọc
                        </button>
                    </div>
                    {filteredAndSortedBuyOrders.length === 0 ? (
                        <p>Không có đơn mua nào.</p>
                    ) : (
                        <ul className="bg-white h-[70vh] overflow-y-auto">
                            {filteredAndSortedBuyOrders.map((order, index) => (
                                <Link to={`/purchaseOrder/${order._id}`} key={order._id}>
                                    <li className="flex border-b p-4 hover:bg-gray-100 transition duration-200">
                                        <div className="text-gray-700">
                                            <span className="font-normal"> <strong>{index + 1}</strong> - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Tổng giá:</strong> <span className="font-normal">{order.total_amount.toLocaleString()} VNĐ - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Ngày mua hàng:</strong> <span className="font-normal">{formatDate(order.createdAt)} - </span>
                                        </div>
                                        <div className="text-gray-700">
                                            <strong>Trạng thái đơn hàng:</strong> <span className="font-normal">{order.status_order}</span>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Order;