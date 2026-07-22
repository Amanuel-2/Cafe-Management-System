import { database } from './database';

export const inventoryService = {
  list() {
    return database.list('inventoryItems');
  },
  getById(id) {
    return database.get('inventoryItems', id);
  },
  create(values) {
    return database.create('inventoryItems', values, 'inventory');
  },
  update(id, values) {
    return database.update('inventoryItems', id, values);
  },
  updateStock(id, stock) {
    return database.update('inventoryItems', id, { stock });
  },
  remove(id) {
    return database.remove('inventoryItems', id);
  },
  getLowStock() {
    return this.list().filter((item) => item.stock <= (item.minimumStock ?? item.parLevel));
  },
};

