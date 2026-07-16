import { Router } from 'express';
import { dataController } from '../controllers/dataController';

export const dataRouter = Router();

dataRouter.get('/dashboard', dataController.getDashboardStats);
dataRouter.get('/menu', dataController.getMenu);
dataRouter.post('/menu', dataController.createMenuItem);
dataRouter.put('/menu/:id', dataController.updateMenuItem);
dataRouter.delete('/menu/:id', dataController.deleteMenuItem);
dataRouter.patch('/menu/:id/availability', dataController.toggleMenuItemAvailability);
dataRouter.get('/employees', dataController.getEmployees);
dataRouter.get('/suppliers', dataController.getSuppliers);
dataRouter.get('/inventory', dataController.getInventory);
dataRouter.get('/notifications', dataController.getNotifications);
dataRouter.patch('/notifications/:id/read', dataController.markNotificationRead);
dataRouter.post('/notifications/read-all', dataController.markAllNotificationsRead);
