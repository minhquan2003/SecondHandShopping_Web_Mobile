import express from 'express';
import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    getOrdersByUserIdBuyerController,
    getOrdersByUserIdSellerController,
    getOrdersByPhoneController,
    getOrdersByStatusOrderController,
    updateOrderController,
    deleteOrderController
} from '../controllers/orderController.js';

const orderRoute = express.Router();

orderRoute.post('/', createOrderController);
orderRoute.get('/', getAllOrdersController);
orderRoute.get('/:id', getOrderByIdController);
orderRoute.get('/buyer/:userId', getOrdersByUserIdBuyerController);
orderRoute.get('/seller/:userId', getOrdersByUserIdSellerController);
orderRoute.get('/phone/:phone', getOrdersByPhoneController);
orderRoute.get('/status/:status', getOrdersByStatusOrderController);
orderRoute.put('/:id', updateOrderController);
orderRoute.delete('/:id', deleteOrderController);

export default orderRoute;