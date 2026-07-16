import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { notificationService } from '../services/notificationService';

export const orderController = {
  getAllOrders: (req: Request, res: Response) => {
    res.json(orderService.getAllOrders());
  },

  getOrderById: (req: Request, res: Response) => {
    const order = orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  },

  createOrder: (req: Request, res: Response) => {
    const order = orderService.createOrder(req.body);
    res.status(201).json(order);
  },

  updateOrder: (req: Request, res: Response) => {
    let updatedOrder;
    if (req.body.status) {
      updatedOrder = orderService.updateOrderStatus(req.params.id, req.body.status, req.body.collectedBy);
    } else if (req.body.paymentStatus) {
      updatedOrder = orderService.updateOrderPayment(req.params.id, req.body.paymentStatus, req.body.paymentMethod, req.body.collectedBy);
    } else if (req.body.itemId) {
      updatedOrder = orderService.updateOrderItemStatus(req.params.id, req.body.itemId, req.body.itemStatus);
    }

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  },
};
