import axios from "axios";

const createPayment = async (pay) => {
    try {
        const response = await axios.post(`http://localhost:5555/payments`, pay);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error create payment:', error);
        throw error;
    }
};

export {createPayment}