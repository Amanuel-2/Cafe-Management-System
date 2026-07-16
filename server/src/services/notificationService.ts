import { store } from '../store';
import { Notification, Order, OrderStatus } from '../types';

export const notificationService = {
  getAllNotifications: () => store.notifications,

  createNotification: (title: string, description: string, type: Notification['type'] = 'order'): Notification => {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      title,
      description,
      read: false,
      createdAt: new Date().toISOString(),
      type,
    };
    store.notifications.unshift(newNotification);
    return newNotification;
  },

  markAsRead: (id: string): Notification | null => {
    const index = store.notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    store.notifications[index].read = true;
    return store.notifications[index];
  },

  markAllAsRead: (): Notification[] => {
    store.notifications.forEach(n => n.read = true);
    return store.notifications;
  },

  createOrderNotification: (order: Order, status: OrderStatus) => {
    let title = '';
    let description = '';

    switch (status) {
      case 'pending':
        title = 'New Order';
        description = `${order.id} has been placed at ${order.table} by ${order.waiterName}.`;
        break;
      case 'accepted':
        title = 'Order Accepted';
        description = `${order.id} has been accepted by the chef.`;
        break;
      case 'preparing':
        title = 'Order Preparing';
        description = `Preparing ${order.id} now.`;
        break;
      case 'ready':
        title = 'Order Ready';
        description = `${order.id} is ready for pickup!`;
        break;
      case 'served':
        title = 'Order Served';
        description = `${order.id} has been served to the table.`;
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        description = `${order.id} has been cancelled.`;
        break;
    }

    if (title) {
      return notificationService.createNotification(title, description, 'order');
    }
    return null;
  },
};
