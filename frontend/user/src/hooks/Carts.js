import axios from 'axios';

const getCartItemsByUserId = async (user_id) => {
    try {
        const response = await axios.get(`http://localhost:5555/carts/${user_id}`);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
};

const addToCart = async (product) => {
    try {
        const response = await axios.post(`http://localhost:5555/carts`, product);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

const removeFromCart = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:5555/carts/${id}`);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export {getCartItemsByUserId, addToCart, removeFromCart};