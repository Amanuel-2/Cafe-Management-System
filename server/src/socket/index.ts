import { Server, Socket } from 'socket.io';
import { orderService } from '../services/orderService';
import { notificationService } from '../services/notificationService';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('order:create', (data: any) => {
      const order = orderService.createOrder(data);
      const notification = notificationService.createOrderNotification(order, 'pending');
      const stats = orderService.getDashboardStats();

      io.emit('order:created', order);
      if (notification) io.emit('notification:new', notification);
      io.emit('dashboard:update', stats);
    });

    socket.on('order:update', (data: { id: string; status: any; [key: string]: any }) => {
      let order;

      if (data.status) {
        order = orderService.updateOrderStatus(data.id, data.status, data.collectedBy);
      } else if (data.paymentStatus) {
        order = orderService.updateOrderPayment(data.id, data.paymentStatus, data.paymentMethod, data.collectedBy);
      } else if (data.itemId) {
        order = orderService.updateOrderItemStatus(data.id, data.itemId, data.itemStatus);
      }

      if (order) {
        const notification = notificationService.createOrderNotification(order, order.status);
        const stats = orderService.getDashboardStats();
        io.emit('order:updated', order);
        if (notification) io.emit('notification:new', notification);
        io.emit('dashboard:update', stats);
      }
    });

    socket.on('notification:read', (id: string) => {
      const updated = notificationService.markAsRead(id);
      if (updated) io.emit('notification:updated', updated);
    });

    socket.on('notification:readAll', () => {
      const updated = notificationService.markAllAsRead();
      io.emit('notifications:updated', updated);
    });
  });
};
