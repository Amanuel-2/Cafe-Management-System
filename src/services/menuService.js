import { database } from './database.js';

function audit(action, actor, item, message) {
  database.create('auditLogs', {
    action,
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    entityType: 'menuItem',
    entityId: item.id,
    message,
  }, 'audit');
}

export const menuService = {
  listCategories() {
    return database.list('categories').sort((a, b) => a.sortOrder - b.sortOrder);
  },
  list(filters = {}) {
    const query = filters.query?.trim().toLowerCase() ?? '';
    return database.list('menuItems').filter((item) => {
      const matchesQuery = !query || item.name.toLowerCase().includes(query) || (item.description ?? '').toLowerCase().includes(query);
      const matchesCategory = !filters.categoryId || filters.categoryId === 'all' || item.categoryId === filters.categoryId;
      const matchesAvailability = filters.available === undefined || item.available === filters.available;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
  },
  getById(id) {
    return database.get('menuItems', id);
  },
  create(values, actor) {
    const name = values.name.trim();
    if (this.list().some((item) => item.name.toLowerCase() === name.toLowerCase())) throw new Error('A menu item with this name already exists.');
    if (!database.get('categories', values.categoryId)) throw new Error('Choose a valid category.');
    const item = database.create('menuItems', { ...values, name, description: values.description.trim() }, 'menu');
    audit('menu.create', actor, item, `${actor?.name ?? 'System'} created menu item ${item.name}`);
    return item;
  },
  update(id, values, actor) {
    const current = this.getById(id);
    if (!current) throw new Error('Menu item not found.');
    const name = values.name.trim();
    if (this.list().some((item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase())) throw new Error('A menu item with this name already exists.');
    if (values.categoryId && !database.get('categories', values.categoryId)) throw new Error('Choose a valid category.');
    const item = database.update('menuItems', id, { ...values, name, description: values.description?.trim() ?? current.description });
    audit('menu.update', actor, item, `${actor?.name ?? 'System'} updated menu item ${item.name}`);
    return item;
  },
  remove(id, actor) {
    const item = this.getById(id);
    if (!item) throw new Error('Menu item not found.');
    if (database.list('recipes').some((recipe) => recipe.menuItemId === id)) throw new Error('Remove the linked recipe before deleting this menu item.');
    database.remove('menuItems', id);
    audit('menu.delete', actor, item, `${actor?.name ?? 'System'} deleted menu item ${item.name}`);
    return true;
  },
  setAvailability(id, available, actor) {
    const current = this.getById(id);
    if (!current) throw new Error('Menu item not found.');
    const item = database.update('menuItems', id, { available });
    audit('menu.availability', actor, item, `${actor?.name ?? 'System'} marked ${item.name} ${available ? 'available' : 'unavailable'}`);
    return item;
  },
};
