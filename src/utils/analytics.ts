import type { Order } from '../types/domain';

export const isDateInRange = (date: Date, start: Date, end: Date) => {
  const d = new Date(date);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(23, 59, 59, 999);
  return d >= s && d <= e;
};

export const getOrdersInRange = (orders: Order[], start: Date, end: Date) => {
  return orders.filter((order) => isDateInRange(new Date(order.createdAt), start, end));
};

export const getTotalRevenue = (orders: Order[]) => {
  return orders.reduce((sum, order) => sum + order.total, 0);
};

export const getTotalOrders = (orders: Order[]) => {
  return orders.length;
};

export const getAverageOrderValue = (orders: Order[]) => {
  if (orders.length === 0) return 0;
  return getTotalRevenue(orders) / orders.length;
};

export const getTopSellingItems = (orders: Order[]) => {
  const itemMap = new Map<string, { name: string; quantity: number; total: number; image: string }>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemMap.get(item.name) || { name: item.name, quantity: 0, total: 0, image: item.image };
      itemMap.set(item.name, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        total: existing.total + item.price * item.quantity,
      });
    });
  });
  return Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);
};

export const getOrdersByHour = (orders: Order[]) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const counts = hours.map(() => 0);
  orders.forEach((order) => {
    const hour = new Date(order.createdAt).getHours();
    counts[hour]++;
  });
  return hours.map((hour) => ({ hour: `${hour}:00`, count: counts[hour] }));
};

export const getWaiterStats = (orders: Order[]) => {
  const waiterMap = new Map<string, { name: string; orders: number; revenue: number }>();
  orders.forEach((order) => {
    const existing = waiterMap.get(order.waiterName) || { name: order.waiterName, orders: 0, revenue: 0 };
    waiterMap.set(order.waiterName, {
      ...existing,
      orders: existing.orders + 1,
      revenue: existing.revenue + order.total,
    });
  });
  return Array.from(waiterMap.values()).sort((a, b) => b.orders - a.orders);
};
