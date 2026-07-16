import { create } from 'zustand';
import { orders as initialOrders } from '../mock/data';
import type { ItemStatus, Order, OrderStatus, PaymentStatus, PaymentMethod } from '../types/domain';

type OrderState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  acceptOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
  markOrderPaid: (orderId: string, paymentMethod: PaymentMethod, collectedBy?: string) => void;
  cancelOrder: (orderId: string) => void;
};

function generateReceiptNumber(): string {
  return `RCP-${Date.now()}`;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: initialOrders,
  addOrder: (orderData) => {
    const now = new Date().toISOString();
    const nextOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1100 + Math.random() * 9000)}`,
      receiptNumber: generateReceiptNumber(),
      createdAt: now,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'cash',
      subtotal: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08,
      discount: 0,
      total: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.08,
      timeline: [{
        id: `t-${Date.now()}`,
        title: 'Order Created',
        timestamp: now,
        completed: true
      }]
    };
    set((state) => ({ orders: [nextOrder, ...state.orders] }));
    return nextOrder;
  },
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
  updateItemStatus: (orderId, itemId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) => item.id === itemId ? { ...item, status } : item),
            }
          : order,
      ),
    })),
  acceptOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          status: 'accepted',
          acceptedAt: now,
          timeline: [
            ...order.timeline,
            { id: `t-${Date.now()}`, title: 'Order Accepted', timestamp: now, completed: true }
          ]
        };
      }),
    })),
  markOrderReady: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          status: 'ready',
          readyAt: now,
          timeline: [
            ...order.timeline,
            { id: `t-${Date.now()}`, title: 'Order Ready', timestamp: now, completed: true }
          ]
        };
      }),
    })),
  markOrderServed: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          status: 'served',
          servedAt: now,
          timeline: [
            ...order.timeline,
            { id: `t-${Date.now()}`, title: 'Order Served', timestamp: now, completed: true }
          ]
        };
      }),
    })),
  markOrderPaid: (orderId, paymentMethod, collectedBy) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          paymentStatus: 'paid',
          paymentMethod,
          paidAt: now,
          collectedBy,
          timeline: [
            ...order.timeline,
            { id: `t-${Date.now()}`, title: 'Payment Received', timestamp: now, completed: true }
          ]
        };
      }),
    })),
  cancelOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toISOString();
        return {
          ...order,
          status: 'cancelled',
          timeline: [
            ...order.timeline,
            { id: `t-${Date.now()}`, title: 'Order Cancelled', timestamp: now, completed: true }
          ]
        };
      }),
    })),
}));
