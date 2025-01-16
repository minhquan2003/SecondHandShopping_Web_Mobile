import mongoose from 'mongoose';
import Orders from '../models/Orders.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addOrders = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu đơn hàng
        const ordersData = [
            {
                // order_id: 'order001',
                user_id_buyer: '671e7157dde710f9657f7c1b',
                user_id_seller: '671e7157dde710f9657f7c1c',
                name: 'John Doe',
                phone: '123456789',
                address: '123 Main St, Anytown, USA',
                total_amount: 59.99,
                status_order: 'Pending',
                note: 'Please deliver by tomorrow.',
                status: true,
            },
            {
                // order_id: 'order002',
                user_id_buyer: '671e7157dde710f9657f7c1c',
                user_id_seller: '671e7157dde710f9657f7c1b',
                name: 'Jane Smith',
                phone: '987654321',
                address: '456 Elm St, Othertown, USA',
                total_amount: 89.99,
                status_order: 'Confirmed',
                note: 'Leave at the front door.',
                status: true,
            },
        ];

        // Tạo và lưu tất cả đơn hàng vào cơ sở dữ liệu
        const createdOrders = await Orders.create(ordersData);

        console.log('Orders added successfully:');
        // console.log(createdOrders);
    } catch (error) {
        console.error('Error adding orders:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addOrders();

export default addOrders;