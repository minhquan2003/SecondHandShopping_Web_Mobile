import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addMessage } from '../../hooks/Message';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { IP } from '../../config';
import nonAvata from "../../assets/img/nonAvata.jpg";

const socket = io(`http://localhost:5555`);

const Chat = () => {
    const { userId, conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState();
    const [user, setUser] = useState();
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

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
            const conversationData = response1.data;
            setConversation(conversationData);

            const u = userId === conversationData.participant1 ? conversationData.participant2 : conversationData.participant1;

            const response = await axios.get(`http://${IP}:5555/messages/${conversationData._id}`);
            setMessages(response.data);

            const response2 = await axios.get(`http://${IP}:5555/users/${u}`);
            setUser(response2.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        let content = text.trim();

        if (media) {
            const formData = new FormData();
            formData.append("file", media);
            formData.append("upload_preset", "images_preset");
            formData.append("cloud_name", "dd6pnq2is");

            const uploadUrl = media.type.startsWith('image/')
                ? 'https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload'
                : 'https://api.cloudinary.com/v1_1/dd6pnq2is/video/upload';

            try {
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData
                });
                const uploadedMediaUrl = await response.json();
                content = uploadedMediaUrl.secure_url;
            } catch (error) {
                console.error('Error uploading media:', error);
                return;
            }
        }

        if (content) {
            const conversationId = conversation._id;
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
            setMedia(null);
            setMediaPreview(null); // Reset tệp đã chọn
        }
    };

    const handleMediaChange = (e) => {
        const selectedMedia = e.target.files[0];
        setMedia(selectedMedia);
        
        if (selectedMedia) {
            const url = URL.createObjectURL(selectedMedia);
            setMediaPreview(url);
        }
    };

    return (
    <div className='w-full bg-main'>
        {user != null ? (
            <div className="flex items-center">
                <img src={user.avatar_url == null ? nonAvata : user.avatar_url} alt="Avatar" className='rounded-full ml-5 mt-2 mb-2 ' style={{ border: '2px solid #eee', width: '50px', height: '50px' }} />
                <p className="ml-3 text-xl font-bold">{user.name}</p>
            </div>
        ) : null}
        <div className='bg-red-100 h-[60%] overflow-y-auto' style={{ padding: '10px', flexGrow: 1 }}>
            {conversation && userId ? (
                <>
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
                                        {message.content.startsWith('http') ? (
                                            message.content.endsWith('.mp4') ? (
                                                <video controls style={{ maxWidth: '100%' }}>
                                                    <source src={message.content} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img src={message.content} alt="Uploaded" style={{ maxWidth: '100%' }} />
                                            )
                                        ) : (
                                            <p style={{ margin: 0 }}><strong>Bạn:</strong> {message.content}</p>
                                        )}
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
                                        {user != null ? (
                                            <>
                                                {message.content.startsWith('http') ? (
                                                    message.content.endsWith('.mp4') ? (
                                                        <video controls style={{ maxWidth: '100%' }}>
                                                            <source src={message.content} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img src={message.content} alt="Uploaded" style={{ maxWidth: '100%' }} />
                                                    )
                                                ) : (
                                                    <p style={{ margin: 0 }}><strong>{user.name}:</strong> {message.content}</p>
                                                )}
                                                <p style={{ margin: '5px 0 0' }}><small>{new Date(message.createdAt).toLocaleString()}</small></p>
                                            </>
                                        ) : null}
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
        {conversation && userId && ( // Chỉ hiển thị phần gửi tin nhắn nếu có cuộc hội thoại
            <div className='h-[20%]'>
                <div className='bg-yellow-100 flex w-full'>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaChange}
                        className="m-2"
                    />
                    {mediaPreview && (
                        <div>
                            {mediaPreview.endsWith('.mp4') ? (
                                <video controls style={{ maxWidth: '100%' }}>
                                    <source src={mediaPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={mediaPreview} alt="Preview" style={{ maxWidth: '100%' }} />
                            )}
                            <button onClick={() => {
                                setMedia(null);
                                setMediaPreview(null);
                            }} className="text-red-500">Hủy chọn</button>
                        </div>
                    )}
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
            </div>
        )}
    </div>
);
};

export default Chat;