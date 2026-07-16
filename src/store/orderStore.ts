import { create } from 'zustand';
import { orders as initialOrders } from '../mock/data';
import type { ItemStatus, Order, OrderStatus } from '../types/domain';

type OrderState = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  acceptOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: initialOrders,
  addOrder: (order) => {
    const nextOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(1100 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
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
              items: order.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
            }
          : order,
      ),
    })),
  acceptOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'preparing', acceptedAt: new Date().toISOString() }
          : order
      ),
    })),
  markOrderReady: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'ready', readyAt: new Date().toISOString() }
          : order
      ),
    })),
  markOrderServed: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'served', servedAt: new Date().toISOString() }
          : order
      ),
    })),
}));
