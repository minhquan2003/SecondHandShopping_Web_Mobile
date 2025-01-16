import axios from 'axios';

const createOrderDetail = async (info) => {
    try {
        const response = await axios.post(`http://localhost:5555/orderdetails`, info);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
};

export {createOrderDetail};