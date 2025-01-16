import mongoose from 'mongoose';
import OrderDetails from '../models/OrderDetails.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addOrderDetails = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu chi tiết đơn hàng
        const orderDetailsData = [
            {
                // order_detail_id: 'detail001',
                order_id: '671e742333a9821831bb55ec',
                product_id: '671e72cd20f7c6cc681c70a0', 
                quantity: 2,
                price: 29.99, 
            },
            {
                // order_detail_id: 'detail002',
                order_id: '671e742333a9821831bb55ec', 
                product_id: '671e72cd20f7c6cc681c70a1',
                quantity: 1,
                price: 19.99, 
            },
            {
                // order_detail_id: 'detail003',
                order_id: '671e742333a9821831bb55ed',
                product_id: '671e72cd20f7c6cc681c70a2', 
                quantity: 1,
                price: 89.99, 
            },
        ];

        const createdOrderDetails = await OrderDetails.create(orderDetailsData);

        console.log('Order details added successfully:');
        // console.log(createdOrderDetails);
    } catch (error) {
        console.error('Error adding order details:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addOrderDetails();

export default addOrderDetails;