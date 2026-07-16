import { store } from '../store';
import type { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod, TimelineEvent, DashboardStats } from '../types';

const generateReceiptNumber = () => `RCP-${Date.now()}`;
const generateOrderId = () => `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

export const orderService = {
  getAllOrders: () => store.orders,

  getOrderById: (id: string) => store.orders.find(order => order.id === id),

  createOrder: (
    orderData: Omit<Order, 'id' | 'receiptNumber' | 'createdAt' | 'timeline' | 'status' | 'paymentStatus' | 'paymentMethod' | 'subtotal' | 'tax' | 'discount' | 'total'> & Partial<Pick<Order, 'paymentMethod'>>
  ): Order => {
    const now = new Date().toISOString();
    const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const discount = 0;
    const total = subtotal + tax - discount;

    const newOrder: Order = {
      id: generateOrderId(),
      receiptNumber: generateReceiptNumber(),
      table: orderData.table,
      waiterName: orderData.waiterName,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: orderData.paymentMethod || 'cash',
      createdAt: now,
      items: orderData.items.map((item, i) => ({ ...item, id: `oi-${Date.now()}-${i}` })),
      subtotal,
      tax,
      discount,
      total,
      timeline: [{ id: `t-${Date.now()}`, title: 'Order Created', timestamp: now, completed: true }],
    };

    store.orders.unshift(newOrder);
    return newOrder;
  },

  updateOrderStatus: (id: string, status: OrderStatus, collectedBy?: string): Order | null => {
    const orderIndex = store.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    const order = store.orders[orderIndex];
    const now = new Date().toISOString();
    const updates: Partial<Order> = { status };
    const newEvents: TimelineEvent[] = [];

    switch (status) {
      case 'accepted':
      case 'preparing':
        if (!order.acceptedAt) {
          updates.acceptedAt = now;
          newEvents.push({ id: `t-${Date.now()}`, title: 'Chef Accepted', timestamp: now, completed: true });
        }
        if (status === 'preparing') {
          newEvents.push({ id: `t-${Date.now() + 1}`, title: 'Preparing', timestamp: now, completed: true });
        }
        break;
      case 'ready':
        updates.readyAt = now;
        newEvents.push({ id: `t-${Date.now()}`, title: 'Order Ready', timestamp: now, completed: true });
        break;
      case 'served':
        updates.servedAt = now;
        newEvents.push({ id: `t-${Date.now()}`, title: 'Order Served', timestamp: now, completed: true });
        break;
      case 'cancelled':
        newEvents.push({ id: `t-${Date.now()}`, title: 'Order Cancelled', timestamp: now, completed: true });
        break;
    }

    const updatedOrder: Order = {
      ...order,
      ...updates,
      timeline: [...order.timeline, ...newEvents],
    };

    store.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  updateOrderPayment: (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    collectedBy?: string
  ): Order | null => {
    const orderIndex = store.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    const order = store.orders[orderIndex];
    const now = new Date().toISOString();
    const updates: Partial<Order> = { paymentStatus };

    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (collectedBy) updates.collectedBy = collectedBy;
    if (paymentStatus === 'paid') {
      updates.paidAt = now;
    }

    const updatedOrder: Order = {
      ...order,
      ...updates,
      timeline: [...order.timeline, {
        id: `t-${Date.now()}`,
        title: paymentStatus === 'paid' ? 'Payment Received' : 'Payment Updated',
        timestamp: now,
        completed: true,
      }],
    };

    store.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']): Order | null => {
    const orderIndex = store.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    const order = store.orders[orderIndex];
    const itemIndex = order.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    const updatedItems = [...order.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], status };

    let updatedStatus: OrderStatus = order.status;
    if (updatedItems.every(item => item.status === 'ready') && order.status !== 'served') {
      updatedStatus = 'ready';
    } else if (updatedItems.some(item => item.status === 'preparing') && order.status !== 'ready' && order.status !== 'served') {
      updatedStatus = 'preparing';
    }

    const now = new Date().toISOString();
    const updatedOrder: Order = {
      ...order,
      items: updatedItems,
      status: updatedStatus,
      readyAt: updatedStatus === 'ready' ? now : order.readyAt,
      timeline: updatedStatus === 'ready' && order.status !== 'ready'
        ? [...order.timeline, { id: `t-${Date.now()}`, title: 'Order Ready', timestamp: now, completed: true }]
        : order.timeline,
    };

    store.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  getDashboardStats: (): DashboardStats => {
    const today = new Date().toDateString();
    const todayOrders = store.orders.filter(order => new Date(order.createdAt).toDateString() === today);
    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => o.paymentStatus === 'paid' ? sum + o.total : sum, 0),
      pendingOrders: store.orders.filter(o => o.status === 'pending').length,
      preparingOrders: store.orders.filter(o => o.status === 'preparing').length,
      readyOrders: store.orders.filter(o => o.status === 'ready').length,
      servedOrders: store.orders.filter(o => o.status === 'served').length,
      paidOrders: store.orders.filter(o => o.paymentStatus === 'paid').length,
      cancelledOrders: store.orders.filter(o => o.status === 'cancelled').length,
    };
  },
};
