import { database } from './database.js';

const sum = (records, selector) => records.reduce((total, record) => total + Number(selector(record) || 0), 0);
const startOfDay = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };
const endOfDay = (value) => { const date = new Date(value); date.setHours(23, 59, 59, 999); return date; };
const inRange = (value, start, end) => { const time = new Date(value).getTime(); return Number.isFinite(time) && time >= start.getTime() && time <= end.getTime(); };
const dateKey = (value) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const displayDay = (value) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(value);

function normalizeRange(range = {}) {
  const end = endOfDay(range.end ?? new Date());
  const start = startOfDay(range.start ?? end);
  if (start > end) throw new Error('Report start date must be before the end date.');
  return { start, end };
}

function buildTrend(start, end, payments, orders) {
  const buckets = [];
  const cursor = startOfDay(start);
  while (cursor <= end) {
    const key = dateKey(cursor);
    buckets.push({ key, name: displayDay(cursor), revenue: 0, orders: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  const byDay = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  payments.forEach((payment) => { const bucket = byDay.get(dateKey(payment.createdAt)); if (bucket) bucket.revenue += Number(payment.amount || 0); });
  orders.forEach((order) => { const bucket = byDay.get(dateKey(order.createdAt)); if (bucket) bucket.orders += 1; });
  return buckets;
}

function topItems(orders) {
  const items = new Map();
  orders.forEach((order) => (order.items ?? []).forEach((line) => {
    const current = items.get(line.menuItemId) ?? { id: line.menuItemId, name: line.name, quantity: 0, revenue: 0 };
    current.quantity += Number(line.quantity || 0);
    current.revenue += Number(line.price || 0) * Number(line.quantity || 0);
    items.set(line.menuItemId, current);
  }));
  return [...items.values()].sort((left, right) => right.quantity - left.quantity || right.revenue - left.revenue).slice(0, 8);
}

export const reportService = {
  getPresetRange(period = 'today', anchor = new Date()) {
    const end = endOfDay(anchor);
    const start = startOfDay(anchor);
    if (period === 'week') start.setDate(start.getDate() - 6);
    if (period === 'month') start.setDate(start.getDate() - 29);
    return { start, end };
  },

  getReport(range) {
    const { start, end } = normalizeRange(range);
    const allOrders = database.list('orders');
    const allReceipts = database.list('receipts');
    const orders = allOrders.filter((order) => inRange(order.createdAt, start, end));
    const payments = database.list('payments').filter((payment) => payment.status === 'completed' && inRange(payment.createdAt, start, end));
    const paymentOrderIds = new Set(payments.map((payment) => payment.orderId));
    const paidOrders = allOrders.filter((order) => paymentOrderIds.has(order.id));
    const receipts = allReceipts.filter((receipt) => paymentOrderIds.has(receipt.orderId));
    const expenses = database.list('expenses').filter((expense) => inRange(`${expense.date}T12:00:00`, start, end));
    const purchases = database.list('purchaseOrders').filter((purchase) => purchase.status === 'received' && inRange(purchase.receivedAt, start, end));
    const revenue = sum(payments, (payment) => payment.amount);
    const receiptRevenue = sum(receipts, (receipt) => receipt.total);
    const expenseTotal = sum(expenses, (expense) => expense.amount);
    const purchaseTotal = sum(purchases, (purchase) => purchase.total);
    const paymentMix = [...payments.reduce((methods, payment) => {
      const current = methods.get(payment.method) ?? { method: payment.method, amount: 0, count: 0 };
      current.amount += Number(payment.amount || 0); current.count += 1; methods.set(payment.method, current); return methods;
    }, new Map()).values()].sort((left, right) => right.amount - left.amount);
    const lowInventory = database.list('inventoryItems').filter((item) => Number(item.stock) <= Number(item.minimumStock ?? item.parLevel ?? 0)).sort((left, right) => (left.stock - (left.minimumStock ?? left.parLevel ?? 0)) - (right.stock - (right.minimumStock ?? right.parLevel ?? 0)));
    return {
      range: { start: start.toISOString(), end: end.toISOString() }, orders, payments, receipts, expenses, purchases,
      revenue, receiptRevenue, orderCount: orders.length, paidOrderCount: paidOrders.length,
      openOrders: orders.filter((order) => !['cancelled'].includes(order.status) && order.paymentStatus !== 'paid').length,
      averageTicket: payments.length ? revenue / payments.length : 0,
      expenseTotal, purchaseTotal, netPerformance: revenue - expenseTotal - purchaseTotal,
      paymentMix, trend: buildTrend(start, end, payments, orders), topItems: topItems(paidOrders), lowInventory,
      recentOrders: [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 10),
      reconciled: Math.abs(revenue - receiptRevenue) < 0.01 && payments.length === receipts.length,
    };
  },

  getDailySnapshot(date = new Date()) {
    const report = this.getReport(this.getPresetRange('today', date));
    return { revenue: report.revenue, orderCount: report.orderCount, paidOrderCount: report.paidOrderCount, openOrders: report.openOrders, averageTicket: report.averageTicket };
  },

  getSummaryCards(date = new Date()) {
    const snapshot = this.getDailySnapshot(date);
    return [
      { id: 'daily-sales', label: 'Today sales', value: `${snapshot.revenue.toLocaleString()} ETB`, change: `${snapshot.paidOrderCount} paid orders`, trend: 'up' },
      { id: 'open-orders', label: 'Open orders', value: String(snapshot.openOrders), change: `${snapshot.orderCount} orders today`, trend: 'up' },
      { id: 'average-ticket', label: 'Average ticket', value: `${snapshot.averageTicket.toLocaleString()} ETB`, change: 'Completed payments', trend: 'up' },
    ];
  },
};
