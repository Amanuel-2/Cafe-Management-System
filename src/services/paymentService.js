import { database } from './database.js';

const now = () => new Date().toISOString();

function calculate(items, discount, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const safeDiscount = Math.min(Math.max(Number(discount) || 0, 0), subtotal + tax);
  return { subtotal, tax, discount: safeDiscount, total: subtotal + tax - safeDiscount };
}

function inventoryUsage(state, items) {
  const usage = new Map();
  items.forEach((line) => {
    const recipe = state.recipes.find((entry) => entry.menuItemId === line.menuItemId);
    if (!recipe) throw new Error(`${line.name} does not have an inventory recipe.`);
    recipe.ingredients.forEach((ingredient) => usage.set(ingredient.inventoryItemId, (usage.get(ingredient.inventoryItemId) ?? 0) + ingredient.quantity * line.quantity));
  });
  usage.forEach((quantity, inventoryItemId) => {
    const item = state.inventoryItems.find((entry) => entry.id === inventoryItemId);
    if (!item) throw new Error('A recipe references a missing inventory item.');
    if (item.stock < quantity) throw new Error(`Insufficient ${item.name}. Required ${quantity} ${item.unit}, available ${item.stock} ${item.unit}.`);
  });
  return usage;
}

function complete(state, order, options, actor) {
  const existingPayment = state.payments.find((entry) => entry.orderId === order.id && entry.status === 'completed');
  if (existingPayment) return { order, payment: existingPayment, receipt: state.receipts.find((entry) => entry.paymentId === existingPayment.id), created: false };
  if (options.customerId && !state.customers.some((customer) => customer.id === options.customerId)) throw new Error('Choose a valid customer.');
  const timestamp = now(); const settings = state.settings ?? {}; const totals = calculate(order.items, options.discount ?? order.discount ?? 0, settings.taxRate ?? 0); const usage = inventoryUsage(state, order.items);
  if (options.method === 'cash' && Number(options.amountTendered) < totals.total) throw new Error('Cash received is less than the order total.');
  const payment = { id: database.createId('payment'), orderId: order.id, method: options.method, amount: totals.total, amountTendered: options.method === 'cash' ? Number(options.amountTendered) : totals.total, change: options.method === 'cash' ? Number(options.amountTendered) - totals.total : 0, status: 'completed', collectedBy: actor?.name ?? 'Cashier', createdAt: timestamp, updatedAt: timestamp };
  const receipt = { id: database.createId('receipt'), receiptNumber: order.receiptNumber, orderId: order.id, paymentId: payment.id, restaurantName: settings.restaurantName ?? 'Restaurant Manager', currency: settings.currency ?? 'ETB', table: order.table, cashierName: actor?.name ?? 'Cashier', items: order.items.map((item) => ({ ...item })), ...totals, paymentMethod: payment.method, amountTendered: payment.amountTendered, change: payment.change, issuedAt: timestamp, createdAt: timestamp, updatedAt: timestamp };
  usage.forEach((quantity, inventoryItemId) => { const item = state.inventoryItems.find((entry) => entry.id === inventoryItemId); item.stock -= quantity; item.updatedAt = timestamp; state.stockMovements.push({ id: database.createId('movement'), inventoryItemId, orderId: order.id, paymentId: payment.id, type: 'sale_usage', quantity: -quantity, reason: `Recipe usage for ${order.receiptNumber}`, actorId: actor?.id ?? 'system', createdAt: timestamp }); });
  Object.assign(order, totals, { customerId: options.customerId || order.customerId || null, status: 'served', paymentStatus: 'paid', paymentMethod: options.method, collectedBy: actor?.name ?? 'Cashier', paidAt: timestamp, updatedAt: timestamp }); order.timeline.push({ id: database.createId('timeline'), title: 'Payment completed', timestamp, completed: true });
  const table = state.tables.find((entry) => entry.id === order.tableId); if (table) { table.status = 'cleaning'; table.updatedAt = timestamp; }
  state.payments.push(payment); state.receipts.push(receipt); state.notifications.push({ id: database.createId('notification'), title: 'Payment completed', description: `${order.receiptNumber} was paid by ${payment.method}.`, type: 'order', audience: 'waiter', read: false, createdAt: timestamp, updatedAt: timestamp }); state.auditLogs.push({ id: database.createId('audit'), action: 'payment.complete', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'payment', entityId: payment.id, message: `${actor?.name ?? 'System'} completed ${order.receiptNumber} for ${totals.total} ${settings.currency ?? 'ETB'}`, createdAt: timestamp, updatedAt: timestamp });
  return { order, payment, receipt, created: true };
}

export const paymentService = {
  list() { return database.list('payments').sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  listReceipts() { return database.list('receipts').sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)); },
  getReceipt(id) { return database.get('receipts', id); },
  getReceiptByNumber(number) { return database.list('receipts').find((receipt) => receipt.receiptNumber.toLowerCase() === number.trim().toLowerCase()) ?? null; },
  payOrder(orderId, options, actor) {
    return database.transaction((state) => { const order = state.orders.find((entry) => entry.id === orderId); if (!order) throw new Error('Order not found.'); if (order.status !== 'served') throw new Error('Only served orders can be paid.'); return complete(state, order, options, actor); }, 'orders,payments,receipts,inventoryItems,stockMovements,tables,notifications,auditLogs');
  },
  checkout(items, options, actor) {
    if (!items?.length) throw new Error('Add at least one menu item.');
    return database.transaction((state) => {
      items.forEach((line) => { const item = state.menuItems.find((entry) => entry.id === line.menuItemId); if (!item || !item.available) throw new Error(`${line.name} is not available.`); if (!Number.isInteger(line.quantity) || line.quantity < 1) throw new Error('Item quantities must be positive whole numbers.'); });
      const timestamp = now(); const sequence = state.orders.length + 1001; const preparedItems = items.map((item) => ({ ...item, id: database.createId('order-item'), status: 'ready' })); const totals = calculate(preparedItems, options.discount, state.settings?.taxRate ?? 0);
      const order = { id: database.createId('order'), receiptNumber: `RCP-${new Date().getFullYear()}-${sequence}`, table: 'Counter', tableId: null, customerId: options.customerId || null, waiterName: actor?.name ?? 'Cashier', status: 'served', paymentStatus: 'unpaid', items: preparedItems, ...totals, billRequested: true, createdAt: timestamp, servedAt: timestamp, updatedAt: timestamp, timeline: [{ id: database.createId('timeline'), title: 'POS order created', timestamp, completed: true }] };
      state.orders.push(order); return complete(state, order, options, actor);
    }, 'orders,payments,receipts,inventoryItems,stockMovements,notifications,auditLogs');
  },
  todaySummary() { const day = new Date().toISOString().slice(0, 10); const payments = this.list().filter((payment) => payment.createdAt.startsWith(day)); return { payments, sales: payments.reduce((sum, payment) => sum + payment.amount, 0), cash: payments.filter((payment) => payment.method === 'cash').reduce((sum, payment) => sum + payment.amount, 0) }; },
};
