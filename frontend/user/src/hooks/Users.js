import axios from 'axios';
import { useEffect, useState } from 'react';

const updateProfile = async (id, info) => {
    try {
        const response = await axios.put(`http://localhost:5555/users/${id}`, info);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
};

const useUserById = (id) => {
    const [sellerInfo, setSellerInfo] = useState([]);

    useEffect(() => {
        const fetchSellerInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/users/${id}`);
                setSellerInfo(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Có thể xử lý lỗi ở đây nếu cần
            }
        };

        fetchSellerInfo();
    }, [id]);
    return sellerInfo;
};

export {updateProfile, useUserById};