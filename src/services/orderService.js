import { database } from './database.js';
import { paymentService } from './paymentService.js';

const transitions = { pending: ['preparing', 'cancelled'], preparing: ['ready', 'cancelled'], ready: ['served'], served: [], cancelled: [] };
const now = () => new Date().toISOString();

function timeline(title, timestamp = now()) { return { id: database.createId('timeline'), title, timestamp, completed: true }; }
function notification(state, title, description, type = 'order', audience = 'staff') { const timestamp = now(); state.notifications.push({ id: database.createId('notification'), title, description, type, audience, read: false, createdAt: timestamp, updatedAt: timestamp }); }
function audit(state, action, actor, order, message) { const timestamp = now(); state.auditLogs.push({ id: database.createId('audit'), action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'order', entityId: order.id, message, createdAt: timestamp, updatedAt: timestamp }); }

export const orderService = {
  list() { return database.list('orders').sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  getById(id) { return database.get('orders', id); },
  create(values, actor) {
    if (!values.items?.length) throw new Error('Add at least one menu item.');
    return database.transaction((state) => {
      const table = state.tables.find((entry) => entry.id === values.tableId); if (!table) throw new Error('Choose a valid table.'); if (table.status !== 'available') throw new Error(`${table.name} is not available.`);
      const timestamp = now(); const subtotal = values.items.reduce((sum, item) => sum + item.price * item.quantity, 0); const tax = subtotal * ((state.settings?.taxRate ?? 0) / 100); const sequence = state.orders.length + 1001;
      const order = { ...values, id: database.createId('order'), table: table.name, waiterName: actor?.name ?? values.waiterName ?? 'Waiter', receiptNumber: `RCP-${new Date().getFullYear()}-${sequence}`, status: 'pending', paymentStatus: 'unpaid', subtotal, tax, discount: 0, total: subtotal + tax, billRequested: false, createdAt: timestamp, updatedAt: timestamp, timeline: [timeline('Order created', timestamp)] };
      state.orders.push(order); table.status = 'occupied'; table.updatedAt = timestamp; notification(state, 'New kitchen order', `${order.receiptNumber} for ${table.name} is waiting to be accepted.`, 'order', 'chef'); audit(state, 'order.create', actor, order, `${actor?.name ?? 'System'} created ${order.receiptNumber} for ${table.name}`); return order;
    }, 'orders,tables,notifications,auditLogs');
  },
  transition(id, nextStatus, actor) {
    return database.transaction((state) => {
      const order = state.orders.find((entry) => entry.id === id); if (!order) throw new Error('Order not found.'); if (!transitions[order.status]?.includes(nextStatus)) throw new Error(`Cannot move an order from ${order.status} to ${nextStatus}.`);
      const timestamp = now(); order.status = nextStatus; order.updatedAt = timestamp; order.timeline.push(timeline(`Order ${nextStatus}`, timestamp));
      if (nextStatus === 'preparing') { order.acceptedAt = timestamp; order.items = order.items.map((item) => ({ ...item, status: 'preparing' })); }
      if (nextStatus === 'ready') { order.readyAt = timestamp; order.items = order.items.map((item) => ({ ...item, status: 'ready' })); notification(state, 'Order ready', `${order.receiptNumber} for ${order.table} is ready to serve.`, 'order', 'waiter'); }
      if (nextStatus === 'served') order.servedAt = timestamp;
      if (nextStatus === 'cancelled') { order.cancelledAt = timestamp; const otherActive = state.orders.some((entry) => entry.id !== id && entry.tableId === order.tableId && !['cancelled'].includes(entry.status) && entry.paymentStatus !== 'paid'); const table = state.tables.find((entry) => entry.id === order.tableId); if (table && !otherActive) table.status = 'available'; }
      audit(state, `order.${nextStatus}`, actor, order, `${actor?.name ?? 'System'} moved ${order.receiptNumber} to ${nextStatus}`); return order;
    }, 'orders,tables,notifications,auditLogs');
  },
  updateItemStatus(orderId, itemId, status, actor) {
    if (!['preparing', 'ready'].includes(status)) throw new Error('Invalid item status.'); const order = this.getById(orderId); if (!order || order.status !== 'preparing') throw new Error('Items can only change while an order is preparing.'); const item = order.items.find((entry) => entry.id === itemId); if (!item) throw new Error('Order item not found.'); const updated = database.update('orders', orderId, { items: order.items.map((entry) => entry.id === itemId ? { ...entry, status } : entry) }); database.create('auditLogs', { action: 'order.item_status', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'order', entityId: orderId, message: `${actor?.name ?? 'System'} marked ${item.name} ${status}` }, 'audit'); return updated;
  },
  requestBill(id, actor) {
    return database.transaction((state) => { const order = state.orders.find((entry) => entry.id === id); if (!order || order.status !== 'served' || order.paymentStatus === 'paid') throw new Error('Only served, unpaid orders can request a bill.'); if (order.billRequested) return order; const timestamp = now(); order.billRequested = true; order.billRequestedAt = timestamp; order.timeline.push(timeline('Bill requested', timestamp)); notification(state, 'Bill requested', `${order.table} requested the bill for ${order.receiptNumber}.`, 'order', 'cashier'); audit(state, 'order.bill_request', actor, order, `${actor?.name ?? 'System'} requested the bill for ${order.receiptNumber}`); return order; }, 'orders,notifications,auditLogs');
  },
  markPaid(id, paymentMethod, actor) {
    const order = this.getById(id);
    return paymentService.payOrder(id, { method: paymentMethod, amountTendered: order?.total ?? 0 }, actor).order;
  },
};
