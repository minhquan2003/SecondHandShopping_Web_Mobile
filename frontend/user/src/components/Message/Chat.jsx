import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addMessage } from '../../hooks/Message';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { IP } from '../../config';

const socket = io(`http://localhost:5555`);

const Chat = () => {
    // const conver = sessionStorage.getItem('conversation');
    // const conversation = conver ? JSON.parse(conver) : null;
    const { userId, conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState();
    const [user, setUser] = useState();
    const [text, setText] = useState('');
    
    useEffect(() => {
        fetchMessages();
        socket.on("newMessage", fetchMessages);
        return () => {
            socket.off("newMessage", fetchMessages);
        };
    }, [conversationId, userId]);

    const fetchMessages = async () => {
            try {
                const response1 = await axios.get(`http://${IP}:5555/conversations/byId/${conversationId}`);
                const conversationData = response1.data; // Lưu giá trị vào biến tạm
                setConversation(conversationData); // Cập nhật state

                const u = userId === conversationData.participant1 ? conversationData.participant2 : conversationData.participant1;

                const response = await axios.get(`http://${IP}:5555/messages/${conversationData._id}`);
                setMessages(response.data);

                const response2 = await axios.get(`http://${IP}:5555/users/${u}`);
                setUser(response2.data);

                // alert(`${conversationId} và ` + JSON.stringify(conversationData))
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
    };

    const handleSend = async () => {
        if (text.trim()) {
            const conversationId = conversation._id;
            const content = text;
            let senderId, receiverId;

            if (conversation.participant1 === userId) {
                senderId = conversation.participant1;
                receiverId = conversation.participant2;
            } else {
                senderId = conversation.participant2;
                receiverId = conversation.participant1;
            }

            await addMessage(conversationId, content, senderId, receiverId);
            socket.emit("sendMessage", { conversationId, content, senderId, receiverId });
            setText('');
            const userSend = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
            senderId = userSend;
            const id = conversation._id
            const aa = await axios.post(`http://${IP}:5555/messages/read/${id}`, {senderId});
        }
    };

    return (
        <div className='w-full bg-green-100'>
            <div className='bg-red-100 h-[60%] overflow-y-auto' style={{ padding: '10px', flexGrow: 1 }}>
                {conversation && userId ? (
                    <>
                        {user != null ?
                        <>
                        <h2>Cuộc Hội Thoại với {user.name}</h2>
                        <img src={user.avatar_url} alt="Avatar" style={{ width: '50px', height: '50px' }} /> </>  : null}
                        
                        {messages.map((message) => (
                            <div key={message._id} style={{ margin: '5px 0', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                                {userId === message.senderId ? (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                        <div style={{ 
                                            backgroundColor: '#dcf8c6',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '75%',
                                            wordWrap: 'break-word',
                                            marginLeft: 'auto'
                                        }}>
                                            <p style={{ margin: 0 }}><strong>Bạn:</strong> {message.content}</p>
                                            <p style={{ margin: '5px 0 0' }}><small>{new Date(message.createdAt).toLocaleString()}</small></p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '10px' }}>
                                        <div style={{ 
                                            backgroundColor: '#ffffff',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            maxWidth: '75%',
                                            wordWrap: 'break-word',
                                            marginRight: 'auto'
                                        }}>
                                            {user != null ? <p style={{ margin: 0 }}><strong>{user.name}:</strong> {message.content}</p> : null}
                                            <p style={{ margin: '5px 0 0' }}><small>{new Date(message.createdAt).toLocaleString()}</small></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <p>Chọn một cuộc hội thoại để xem tin nhắn.</p>
                )}
            </div>
            <div className='h-[20%]'>
                {conversation ? (
                    <div className='bg-yellow-100 flex w-full'>
                        <label className="m-2 w-[80%] mt-10 mb-10">
                            <input 
                                value={text} 
                                onChange={(e) => setText(e.target.value)} 
                                className="mt-1 rounded-full block w-full border-2 border-gray-300 p-2"
                                required
                            />
                        </label>
                        <button 
                            onClick={handleSend}
                            className='bg-blue-600 text-white rounded-full border border-black w-[6%] mt-10 mb-10'
                        >Gửi</button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Chat;