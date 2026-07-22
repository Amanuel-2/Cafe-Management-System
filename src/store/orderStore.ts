import { create } from 'zustand';
import type { ItemStatus, Order, OrderStatus, PaymentMethod } from '../types/domain';
import { database } from '../services/database';

type OrderState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  prependOrder: (order: Order) => void;
  upsertOrder: (order: Order) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'receiptNumber' | 'subtotal' | 'tax' | 'discount' | 'total' | 'status' | 'paymentStatus'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, collectedBy?: string) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  acceptOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
  markOrderPaid: (orderId: string, paymentMethod: PaymentMethod, collectedBy?: string) => void;
  cancelOrder: (orderId: string) => void;
};

const addTimelineEvent = (order: Order, title: string) => ({
  ...order,
  timeline: [...order.timeline, { id: `timeline-${Date.now()}`, title, timestamp: new Date().toISOString(), completed: true }],
});

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: database.list('orders') as Order[],
  setOrders: (orders) => set({ orders }),
  prependOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  upsertOrder: (order) => set((state) => ({
    orders: state.orders.some((existingOrder) => existingOrder.id === order.id)
      ? state.orders.map((existingOrder) => existingOrder.id === order.id ? order : existingOrder)
      : [order, ...state.orders],
  })),

  addOrder: async (orderData) => {
    const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * (database.getSettings().taxRate / 100);
    const createdAt = new Date().toISOString();
    const orderNumber = database.list('orders').length + 1001;
    const newOrder = database.create('orders', {
      ...orderData,
      receiptNumber: `RCP-${new Date().getFullYear()}-${orderNumber}`,
      status: 'pending',
      paymentStatus: 'unpaid',
      subtotal,
      tax,
      discount: 0,
      total: subtotal + tax,
      createdAt,
      timeline: [{ id: `timeline-${Date.now()}`, title: 'Order Created', timestamp: createdAt, completed: true }],
    }, 'order') as Order;
    get().prependOrder(newOrder);
    return newOrder;
  },

  updateOrderStatus: (orderId, status, collectedBy) => {
    const order = database.get('orders', orderId) as Order | null;
    if (!order) return;
    const timestampField = status === 'preparing' ? 'acceptedAt' : status === 'ready' ? 'readyAt' : status === 'served' ? 'servedAt' : null;
    const values = { status, ...(collectedBy ? { collectedBy } : {}), ...(timestampField ? { [timestampField]: new Date().toISOString() } : {}) };
    const updated = database.update('orders', orderId, values) as Order;
    get().upsertOrder(addTimelineEvent(updated, status === 'preparing' ? 'Chef Accepted' : `Order ${status}`));
    database.update('orders', orderId, get().orders.find((item) => item.id === orderId));
  },

  updateItemStatus: (orderId, itemId, status) => {
    const order = database.get('orders', orderId) as Order | null;
    if (!order) return;
    const updated = database.update('orders', orderId, { items: order.items.map((item) => item.id === itemId ? { ...item, status } : item) }) as Order;
    get().upsertOrder(updated);
  },

  acceptOrder: (orderId) => {
    get().updateOrderStatus(orderId, 'preparing');
  },

  markOrderReady: (orderId) => {
    get().updateOrderStatus(orderId, 'ready');
  },

  markOrderServed: (orderId) => {
    get().updateOrderStatus(orderId, 'served');
  },

  markOrderPaid: (orderId, paymentMethod, collectedBy) => {
    const order = database.get('orders', orderId) as Order | null;
    if (!order) return;
    const paidAt = new Date().toISOString();
    const updated = database.update('orders', orderId, { paymentStatus: 'paid', paymentMethod, collectedBy, paidAt }) as Order;
    const withTimeline = addTimelineEvent(updated, 'Order Paid');
    database.update('orders', orderId, withTimeline);
    get().upsertOrder(withTimeline);
  },

  cancelOrder: (orderId) => {
    get().updateOrderStatus(orderId, 'cancelled');
  },
}));
