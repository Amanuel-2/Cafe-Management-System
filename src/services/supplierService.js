import { database } from './database.js';

function audit(action, actor, supplier, message) {
  database.create('auditLogs', { action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'supplier', entityId: supplier.id, message }, 'audit');
}

function validate(values, currentId) {
  const name = values.name.trim();
  if (name.length < 2) throw new Error('Supplier name must contain at least 2 characters.');
  if (database.list('suppliers').some((supplier) => supplier.id !== currentId && supplier.name.toLowerCase() === name.toLowerCase())) throw new Error('A supplier with this name already exists.');
}

export const supplierService = {
  list() {
    return database.list('suppliers');
  },
  getById(id) {
    return database.get('suppliers', id);
  },
  create(values, actor) {
    validate(values);
    const supplier = database.create('suppliers', { ...values, name: values.name.trim() }, 'supplier');
    audit('supplier.create', actor, supplier, `${actor?.name ?? 'System'} created supplier ${supplier.name}`);
    return supplier;
  },
  update(id, values, actor) {
    if (!this.getById(id)) throw new Error('Supplier not found.');
    validate(values, id);
    const supplier = database.update('suppliers', id, { ...values, name: values.name.trim() });
    audit('supplier.update', actor, supplier, `${actor?.name ?? 'System'} updated supplier ${supplier.name}`);
    return supplier;
  },
  remove(id, actor) {
    const supplier = this.getById(id);
    if (!supplier) throw new Error('Supplier not found.');
    if (database.list('inventoryItems').some((item) => item.supplierId === id)) throw new Error('Reassign inventory items before deleting this supplier.');
    if (database.list('purchaseOrders').some((order) => order.supplierId === id)) throw new Error('Suppliers with purchase history cannot be deleted.');
    database.remove('suppliers', id);
    audit('supplier.delete', actor, supplier, `${actor?.name ?? 'System'} deleted supplier ${supplier.name}`);
    return true;
  },
  getPurchaseHistory(id) {
    return database.list('purchaseOrders').filter((order) => order.supplierId === id).sort((a, b) => (b.orderDate ?? '').localeCompare(a.orderDate ?? ''));
  },
};
