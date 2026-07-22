import { database } from './database.js';

const now = () => new Date().toISOString();

function total(items) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
}

function validate(values, currentId) {
  const supplier = database.get('suppliers', values.supplierId);
  if (!supplier || supplier.status !== 'active') throw new Error('Choose an active supplier.');
  if (!values.items?.length) throw new Error('Add at least one purchase item.');
  const ids = values.items.map((item) => item.inventoryItemId);
  if (new Set(ids).size !== ids.length) throw new Error('Each inventory item can only appear once.');
  values.items.forEach((line) => {
    const item = database.get('inventoryItems', line.inventoryItemId);
    if (!item) throw new Error('Choose a valid inventory item.');
    if (item.supplierId && item.supplierId !== values.supplierId) throw new Error(`${item.name} is assigned to a different supplier.`);
    if (![line.quantity, line.unitCost].every((value) => Number.isFinite(value) && value > 0)) throw new Error('Purchase quantity and unit cost must be greater than zero.');
  });
  if (currentId && !database.get('purchaseOrders', currentId)) throw new Error('Purchase order not found.');
}

function audit(action, actor, order, message) {
  database.create('auditLogs', { action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'purchaseOrder', entityId: order.id, message }, 'audit');
}

export const purchaseOrderService = {
  list() {
    return database.list('purchaseOrders').sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  },
  getById(id) {
    return database.get('purchaseOrders', id);
  },
  create(values, actor) {
    validate(values);
    const order = database.create('purchaseOrders', { ...values, status: 'draft', total: total(values.items), orderDate: values.orderDate || now().slice(0, 10) }, 'purchase');
    audit('purchase.create', actor, order, `${actor?.name ?? 'System'} created purchase order ${order.id}`);
    return order;
  },
  update(id, values, actor) {
    const current = this.getById(id);
    if (!current) throw new Error('Purchase order not found.');
    if (current.status !== 'draft') throw new Error('Only draft purchase orders can be edited.');
    validate(values, id);
    const order = database.update('purchaseOrders', id, { ...values, status: 'draft', total: total(values.items) });
    audit('purchase.update', actor, order, `${actor?.name ?? 'System'} updated purchase order ${order.id}`);
    return order;
  },
  submit(id, actor) {
    const current = this.getById(id);
    if (!current || current.status !== 'draft') throw new Error('Only draft purchase orders can be submitted.');
    const order = database.update('purchaseOrders', id, { status: 'submitted', submittedAt: now() });
    audit('purchase.submit', actor, order, `${actor?.name ?? 'System'} submitted purchase order ${order.id}`);
    return order;
  },
  cancel(id, actor) {
    const current = this.getById(id);
    if (!current || !['draft', 'submitted'].includes(current.status)) throw new Error('Only draft or submitted purchase orders can be cancelled.');
    const order = database.update('purchaseOrders', id, { status: 'cancelled', cancelledAt: now() });
    audit('purchase.cancel', actor, order, `${actor?.name ?? 'System'} cancelled purchase order ${order.id}`);
    return order;
  },
  receive(id, actor) {
    return database.transaction((state) => {
      const order = state.purchaseOrders.find((entry) => entry.id === id);
      if (!order) throw new Error('Purchase order not found.');
      if (order.status === 'received') return order;
      if (order.status !== 'submitted') throw new Error('Only submitted purchase orders can be received.');
      const timestamp = now();
      const movementIds = [];
      order.items.forEach((line) => {
        const item = state.inventoryItems.find((entry) => entry.id === line.inventoryItemId);
        if (!item) throw new Error('A purchase item no longer exists in inventory.');
        item.stock += line.quantity;
        item.cost = line.unitCost;
        item.updatedAt = timestamp;
        const movement = { id: database.createId('movement'), inventoryItemId: item.id, purchaseOrderId: order.id, supplierId: order.supplierId, type: 'purchase_receipt', quantity: line.quantity, unitCost: line.unitCost, actorId: actor?.id ?? 'system', createdAt: timestamp };
        state.stockMovements.push(movement);
        movementIds.push(movement.id);
      });
      order.status = 'received';
      order.receivedAt = timestamp;
      order.movementIds = movementIds;
      order.updatedAt = timestamp;
      state.auditLogs.push({ id: database.createId('audit'), action: 'purchase.receive', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'purchaseOrder', entityId: order.id, message: `${actor?.name ?? 'System'} received purchase order ${order.id}`, createdAt: timestamp, updatedAt: timestamp });
      return order;
    }, 'purchaseOrders,inventoryItems,stockMovements,auditLogs');
  },
  remove(id, actor) {
    const order = this.getById(id);
    if (!order || order.status !== 'draft') throw new Error('Only draft purchase orders can be deleted.');
    database.remove('purchaseOrders', id);
    audit('purchase.delete', actor, order, `${actor?.name ?? 'System'} deleted purchase order ${order.id}`);
    return true;
  },
};
