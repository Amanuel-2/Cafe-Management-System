import { database } from './database';

function isSameDay(value, date) {
  const recordDate = new Date(value);
  return recordDate.getFullYear() === date.getFullYear()
    && recordDate.getMonth() === date.getMonth()
    && recordDate.getDate() === date.getDate();
}

export const reportService = {
  getDailySnapshot(date = new Date()) {
    const orders = database.list('orders').filter((order) => isSameDay(order.createdAt, date));
    const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');
    const revenue = paidOrders.reduce((total, order) => total + order.total, 0);
    const openOrders = orders.filter((order) => !['completed', 'cancelled'].includes(order.status)).length;
    const averageTicket = paidOrders.length ? revenue / paidOrders.length : 0;
    return { revenue, orderCount: orders.length, paidOrderCount: paidOrders.length, openOrders, averageTicket };
  },
  getSummaryCards(date = new Date()) {
    const snapshot = this.getDailySnapshot(date);
    return [
      { id: 'daily-sales', label: 'Today sales', value: `${snapshot.revenue.toLocaleString()} ETB`, change: `${snapshot.paidOrderCount} paid orders`, trend: 'up' },
      { id: 'open-orders', label: 'Open orders', value: String(snapshot.openOrders), change: `${snapshot.orderCount} orders today`, trend: 'up' },
      { id: 'average-ticket', label: 'Average ticket', value: `${snapshot.averageTicket.toLocaleString()} ETB`, change: 'Paid orders', trend: 'up' },
    ];
  },
};

