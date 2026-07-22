import { database } from './database';

export const supplierService = {
  list() {
    return database.list('suppliers');
  },
  getById(id) {
    return database.get('suppliers', id);
  },
  create(values) {
    return database.create('suppliers', values, 'supplier');
  },
  update(id, values) {
    return database.update('suppliers', id, values);
  },
  remove(id) {
    return database.remove('suppliers', id);
  },
};

