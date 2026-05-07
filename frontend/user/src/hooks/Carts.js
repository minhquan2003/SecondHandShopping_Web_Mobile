import axios from 'axios';
import { IP } from '../config';

const getCartItemsByUserId = async (user_id) => {
    try {
        const response = await axios.get(`${IP}/carts/${user_id}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
};

const addToCart = async (product) => {
    try {
        const response = await axios.post(`${IP}/carts`, product);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

const removeFromCart = async (id) => {
    try {
        const response = await axios.delete(`${IP}/carts/${id}`);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export {getCartItemsByUserId, addToCart, removeFromCart};
