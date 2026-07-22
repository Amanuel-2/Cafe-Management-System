import { database } from './database.js';

export const settingsService = {
  get() { return database.getSettings(); },
  update(values, actor) { if (values.restaurantName.trim().length < 2) throw new Error('Restaurant name is required.'); if (!Number.isFinite(values.taxRate) || values.taxRate < 0 || values.taxRate > 100) throw new Error('Tax rate must be between 0 and 100.'); const settings = database.updateSettings({ ...values, restaurantName: values.restaurantName.trim(), currency: values.currency.trim().toUpperCase() }); database.create('auditLogs', { action: 'settings.update', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'settings', entityId: 'restaurant-settings', message: `${actor?.name ?? 'System'} updated restaurant settings` }, 'audit'); return settings; },
};
