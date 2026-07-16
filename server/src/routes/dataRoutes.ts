import { Router } from 'express';
import { dataController } from '../controllers/dataController';

export const dataRouter = Router();

dataRouter.get('/dashboard', dataController.getDashboardStats);
dataRouter.get('/menu', dataController.getMenu);
dataRouter.get('/employees', dataController.getEmployees);
dataRouter.get('/suppliers', dataController.getSuppliers);
dataRouter.get('/inventory', dataController.getInventory);
dataRouter.get('/notifications', dataController.getNotifications);
dataRouter.get('/reports', dataController.getReports);
dataRouter.patch('/notifications/:id/read', dataController.markNotificationRead);
dataRouter.post('/notifications/read-all', dataController.markAllNotificationsRead);
