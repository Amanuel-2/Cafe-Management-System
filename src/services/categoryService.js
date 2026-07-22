import { database } from './database.js';

function audit(action, actor, category, message) {
  database.create('auditLogs', {
    action,
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    entityType: 'category',
    entityId: category.id,
    message,
  }, 'audit');
}

export const categoryService = {
  list() {
    return database.list('categories').sort((left, right) => left.sortOrder - right.sortOrder);
  },
  getById(id) {
    return database.get('categories', id);
  },
  create(values, actor) {
    const name = values.name.trim();
    if (this.list().some((category) => category.name.toLowerCase() === name.toLowerCase())) throw new Error('A category with this name already exists.');
    const lastSortOrder = this.list().reduce((maximum, category) => Math.max(maximum, category.sortOrder ?? 0), 0);
    const category = database.create('categories', { ...values, name, sortOrder: lastSortOrder + 1 }, 'category');
    audit('category.create', actor, category, `${actor?.name ?? 'System'} created category ${category.name}`);
    return category;
  },
  update(id, values, actor) {
    const current = this.getById(id);
    if (!current) throw new Error('Category not found.');
    const name = values.name.trim();
    if (this.list().some((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase())) throw new Error('A category with this name already exists.');
    const category = database.update('categories', id, { ...values, name, sortOrder: current.sortOrder });
    audit('category.update', actor, category, `${actor?.name ?? 'System'} updated category ${category.name}`);
    return category;
  },
  remove(id, actor) {
    const category = this.getById(id);
    if (!category) throw new Error('Category not found.');
    if (database.list('menuItems').some((item) => item.categoryId === id)) throw new Error('Move or delete menu items before deleting this category.');
    database.remove('categories', id);
    audit('category.delete', actor, category, `${actor?.name ?? 'System'} deleted category ${category.name}`);
    return true;
  },
  getItemCount(id) {
    return database.list('menuItems').filter((item) => item.categoryId === id).length;
  },
};

