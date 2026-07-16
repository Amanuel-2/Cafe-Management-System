import { Request, Response } from 'express';
import { store } from '../store';
import { orderService } from '../services/orderService';
import { notificationService } from '../services/notificationService';

export const dataController = {
  getDashboardStats: (req: Request, res: Response) => {
    res.json(orderService.getDashboardStats());
  },

  getMenu: (req: Request, res: Response) => {
    res.json({ categories: store.categories, items: store.menuItems });
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
  },

  markAllNotificationsRead: (req: Request, res: Response) => {
    res.json(notificationService.markAllAsRead());
  },

  getReports: (req: Request, res: Response) => {
    res.json(store.reports);
  },
};
