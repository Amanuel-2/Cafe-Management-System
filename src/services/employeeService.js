import { database } from './database';

export const employeeService = {
  list() {
    return database.list('employees');
  },
  getById(id) {
    return database.get('employees', id);
  },
  create(values) {
    return database.create('employees', values, 'employee');
  },
  update(id, values) {
    return database.update('employees', id, values);
  },
  remove(id) {
    return database.remove('employees', id);
  },
};

