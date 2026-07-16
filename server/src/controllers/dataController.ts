import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { store } from '../store';
import { orderService } from '../services/orderService';
import { notificationService } from '../services/notificationService';
import { menuService } from '../services/menuService';

export const createDataController = (io: Server) => {
  return {
    getDashboardStats: (req: Request, res: Response) => {
      res.json(orderService.getDashboardStats());
    },

    getMenu: (req: Request, res: Response) => {
      res.json({ categories: store.categories, items: store.menuItems });
    },

    createMenuItem: (req: Request, res: Response) => {
      const item = menuService.addItem(req.body);
      res.json(item);
      io.emit('menu:created', item);
    },

    updateMenuItem: (req: Request, res: Response) => {
      const item = menuService.updateItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json(item);
      io.emit('menu:updated', item);
    },

    deleteMenuItem: (req: Request, res: Response) => {
      const success = menuService.removeItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(204).send();
      io.emit('menu:deleted', req.params.id);
    },

    toggleMenuItemAvailability: (req: Request, res: Response) => {
      const item = menuService.setAvailability(req.params.id, req.body.available);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.json(item);
      io.emit('menu:availability:updated', item);
    },

    getEmployees: (req: Request, res: Response) => {
      res.json(store.employees);
    },

    getSuppliers: (req: Request, res: Response) => {
      res.json(store.suppliers);
    },

    getInventory: (req: Request, res: Response) => {
      res.json(store.inventory);
    },

    getNotifications: (req: Request, res: Response) => {
      res.json(notificationService.getAllNotifications());
    },

    markNotificationRead: (req: Request, res: Response) => {
      const updated = notificationService.markAsRead(req.params.id);
      if (!updated) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json(updated);
      io.emit('notification:updated', updated);
    },

    markAllNotificationsRead: (req: Request, res: Response) => {
      const updated = notificationService.markAllAsRead();
      res.json(updated);
      io.emit('notifications:updated', updated);
    },

    getReports: (req: Request, res: Response) => {
      res.json(store.reports);
    },
  };
};
