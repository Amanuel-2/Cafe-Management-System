import { Router } from 'express';
import { orderController } from '../controllers/orderController';

export const orderRouter = Router();

orderRouter.get('/', orderController.getAllOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/', orderController.createOrder);
orderRouter.patch('/:id', orderController.updateOrder);
