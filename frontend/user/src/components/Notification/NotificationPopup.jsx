import React from 'react';
import { updateNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';

const socket = io('http://localhost:5555');

const NotificationPopup = ({ notifications, onClose }) => {

    const handleRead = async (id) => { 
        const readed = true;
        await updateNotification(id, readed);
        socket.emit('sendNotification');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg p-4 z-50">
            <h3 className="font-bold mb-2">Thông Báo</h3>
            {notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                        <li
                            onClick={() => handleRead(notification._id)}
                            key={notification._id}
                            className={`border-b-2 border-yellow-300 py-1 cursor-pointer ${!notification.readed ? 'font-bold' : 'font-normal'}`} 
                        >
                            {notification.message}<br/>
                            <span className="text-gray-500 text-sm">{formatDate(notification.createdAt)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có thông báo nào.</p>
            )}
            <button onClick={onClose} className="mt-2 text-blue-500">
                Đóng
            </button>
        </div>
    );
};

export default NotificationPopup;