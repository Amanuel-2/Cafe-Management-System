import type { Order } from '../types/domain';
import type { TimePeriodType } from '../store/analyticsStore';

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

// Get period start/end hours
export const getPeriodHours = (period: TimePeriodType): { startHour: number; endHour: number } => {
  switch (period) {
    case 'morning':
      return { startHour: 6, endHour: 11 }; // 06:00-11:59
    case 'lunch':
      return { startHour: 12, endHour: 14 }; //12:00-14:59
    case 'afternoon':
      return { startHour: 15, endHour: 17 }; //15:00-17:59
    case 'evening':
      return { startHour: 18, endHour: 22 }; //18:00-22:00
    case 'full-day':
    default:
      return { startHour: 0, endHour: 23 }; //00:00-23:59
  }
};

export const isOrderInHour = (order: Order, hour: number): boolean => {
  return new Date(order.createdAt).getHours() === hour;
};

export const isOrderInPeriod = (order: Order, period: TimePeriodType): boolean => {
  const { startHour, endHour } = getPeriodHours(period);
  const orderHour = new Date(order.createdAt).getHours();
  return orderHour >= startHour && orderHour <= endHour;
};

export const getOrdersInHourOrPeriod = (
  orders: Order[],
  selectedHour: number | null,
  selectedPeriod: TimePeriodType
): Order[] => {
  if (selectedHour !== null) {
    return orders.filter(order => isOrderInHour(order, selectedHour));
  }
  return orders.filter(order => isOrderInPeriod(order, selectedPeriod));
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
  const revenue = hours.map(() => 0);
  orders.forEach((order) => {
    const hour = new Date(order.createdAt).getHours();
    counts[hour]++;
    revenue[hour] += order.total;
  });
  return hours.map((hour) => ({ hour, count: counts[hour], revenue: revenue[hour] }));
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

// Get activity level based on order count
export const getActivityLevel = (orderCount: number): { label: string; color: string; bgColor: string } => {
  if (orderCount === 0) return { label: 'No activity', color: 'text-stone-400', bgColor: 'bg-stone-100 dark:bg-stone-800' };
  if (orderCount <= 3) return { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' };
  if (orderCount <= 7) return { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
  if (orderCount <= 12) return { label: 'Busy', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
  return { label: 'Peak', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' };
};
