import { database } from './database.js';

const activeStatuses = ['pending', 'preparing', 'ready', 'served'];

function audit(action, actor, table, message) {
  database.create('auditLogs', { action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'table', entityId: table.id, message }, 'audit');
}

function validate(values, currentId) {
  const name = values.name.trim().toUpperCase();
  if (name.length < 2) throw new Error('Table name must contain at least 2 characters.');
  if (database.list('tables').some((table) => table.id !== currentId && table.name.toUpperCase() === name)) throw new Error('A table with this name already exists.');
  if (!Number.isInteger(values.capacity) || values.capacity < 1) throw new Error('Capacity must be at least one guest.');
}

export const tableService = {
  list() { return database.list('tables').sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); },
  getById(id) { return database.get('tables', id); },
  create(values, actor) { validate(values); const table = database.create('tables', { ...values, name: values.name.trim().toUpperCase(), section: values.section.trim(), status: values.status ?? 'available' }, 'table'); audit('table.create', actor, table, `${actor?.name ?? 'System'} created table ${table.name}`); return table; },
  update(id, values, actor) {
    const current = this.getById(id); if (!current) throw new Error('Table not found.'); validate(values, id);
    const hasActiveOrder = database.list('orders').some((order) => order.tableId === id && activeStatuses.includes(order.status) && order.paymentStatus !== 'paid' && order.status !== 'cancelled');
    if (hasActiveOrder && values.status !== 'occupied') throw new Error('This table has an active order and must remain occupied.');
    const table = database.update('tables', id, { ...values, name: values.name.trim().toUpperCase(), section: values.section.trim() }); audit('table.update', actor, table, `${actor?.name ?? 'System'} updated table ${table.name}`); return table;
  },
  setStatus(id, status, actor) { const current = this.getById(id); if (!current) throw new Error('Table not found.'); return this.update(id, { ...current, status }, actor); },
  remove(id, actor) { const table = this.getById(id); if (!table) throw new Error('Table not found.'); if (database.list('orders').some((order) => order.tableId === id)) throw new Error('Tables with order history cannot be deleted.'); database.remove('tables', id); audit('table.delete', actor, table, `${actor?.name ?? 'System'} deleted table ${table.name}`); return true; },
};
