import { database } from './database';

export const menuService = {
  listCategories() {
    return database.list('categories').sort((a, b) => a.sortOrder - b.sortOrder);
  },
  list(filters = {}) {
    const query = filters.query?.trim().toLowerCase() ?? '';
    return database.list('menuItems').filter((item) => {
      const matchesQuery = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      const matchesCategory = !filters.categoryId || filters.categoryId === 'all' || item.categoryId === filters.categoryId;
      const matchesAvailability = filters.available === undefined || item.available === filters.available;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
  },
  getById(id) {
    return database.get('menuItems', id);
  },
  create(values) {
    return database.create('menuItems', values, 'menu');
  },
  update(id, values) {
    return database.update('menuItems', id, values);
  },
  remove(id) {
    return database.remove('menuItems', id);
  },
};

