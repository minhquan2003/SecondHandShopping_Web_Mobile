import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5555');

const ListMessage = ({ userId }) => {
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]); // Mảng để lưu thông tin người dùng
    const navigate = useNavigate();

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

    const unReadMess = async (idConver, user) => {
        const response = await axios.get(`http://localhost:5555/messages/${idConver}`);
        const messages = response.data; // Lấy dữ liệu tin nhắn

        // Sử dụng reduce để đếm số tin nhắn có trạng thái 'sent'
        const count = messages.reduce((acc, mess) => {
            return (mess.statusMessage === 'sent' && mess.senderId != user) ? acc + 1 : acc; // Tăng biến acc nếu trạng thái là 'sent'
        }, 0); // Khởi tạo acc với giá trị 0

        return count;
    };

    useEffect(() => {
        fetchConversations();
        const handleNewMessage = () => {
            fetchConversations();
        };
        socket.on("newMessage", handleNewMessage);
    
        // Gỡ bỏ sự kiện khi component bị hủy
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [userId]);

    const fetchConversations = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/conversations/${userId}`);
                

                const conversa = await Promise.all(response.data.map(async (conversation) => {
                    const unRead = await unReadMess(conversation._id, userId); // Gọi hàm bất đồng bộ để lấy số tin nhắn chưa đọc
                    return {
                        ...conversation, // Giữ lại tất cả các trường dữ liệu gốc
                        unRead // Thêm trường unRead vào đối tượng
                    };
                }));

                setConversations(conversa);

                // Lấy thông tin người dùng cho từng cuộc hội thoại
                const participantIds = response.data.map(conversation => 
                    conversation.participant1 === userId ? conversation.participant2 : conversation.participant1
                );

                // Gọi API để lấy thông tin người dùng
                const userPromises = participantIds.map(id => axios.get(`http://localhost:5555/users/${id}`));
                const userResponses = await Promise.all(userPromises);

                // Lưu thông tin người dùng vào mảng
                const usersData = userResponses.map(userResponse => userResponse.data);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

    const handleSelectConversation = async (conversation) => {
        const userSend = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
        const senderId = userSend;
        const id = conversation._id
        const aa = await axios.post(`http://localhost:5555/messages/read/${id}`, {senderId});
        // Chuyển hướng đến đường dẫn mới với mã cuộc trò chuyện
        navigate(`/message/${userId}/${conversation._id}`);
    };

    return (
        <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h2>Danh Sách Cuộc Hội Thoại</h2>
            {conversations.map((conversation, index) => {
                const participantId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
                const user = users[index]; // Lấy thông tin người dùng từ mảng

                return (
                    <div 
                        key={conversation._id} 
                        className="conversation" 
                        onClick={() => handleSelectConversation(conversation)} // Gửi cuộc hội thoại khi chọn
                        style={{ cursor: 'pointer', marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}
                    >
                        <p>{user ? user.name : participantId}</p>
                        <p>Tin nhắn chưa đọc: {conversation.unRead}</p>
                        <span>
                            <p>{conversation.lastMessage || 'Không có tin nhắn'}</p>
                            <p>{conversation.lastMessageTimestamp ? formatDate(conversation.lastMessageTimestamp) : 'Chưa có tin nhắn'}</p>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ListMessage;