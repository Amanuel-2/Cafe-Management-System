import { create } from 'zustand';
import { socket } from '../services/socket';
import type { ItemStatus, Order, OrderStatus, PaymentMethod } from '../types/domain';
import { useEffect } from 'react';

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

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  prependOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  upsertOrder: (order) => set((state) => ({
    orders: state.orders.some((existingOrder) => existingOrder.id === order.id)
      ? state.orders.map((existingOrder) => existingOrder.id === order.id ? order : existingOrder)
      : [order, ...state.orders],
  })),

  addOrder: async (orderData) => {
    socket.emit('order:create', orderData);
    const newOrder = await new Promise<Order>((resolve) => {
      const handler = (order: Order) => {
        resolve(order);
        socket.off('order:created', handler);
      };
      socket.on('order:created', handler);
    });
    return newOrder;
  },

  updateOrderStatus: (orderId, status, collectedBy) => {
    socket.emit('order:update', { id: orderId, status, collectedBy });
  },

  updateItemStatus: (orderId, itemId, status) => {
    socket.emit('order:update', { id: orderId, itemId, itemStatus: status });
  },

  acceptOrder: (orderId) => {
    socket.emit('order:update', { id: orderId, status: 'preparing' });
  },

  markOrderReady: (orderId) => {
    socket.emit('order:update', { id: orderId, status: 'ready' });
  },

  markOrderServed: (orderId) => {
    socket.emit('order:update', { id: orderId, status: 'served' });
  },

  markOrderPaid: (orderId, paymentMethod, collectedBy) => {
    socket.emit('order:update', { id: orderId, paymentStatus: 'paid', paymentMethod, collectedBy });
  },

  cancelOrder: (orderId) => {
    socket.emit('order:update', { id: orderId, status: 'cancelled' });
  },
}));

export function useOrderSocketSync() {
  const setOrders = useOrderStore((state) => state.setOrders);
  const prependOrder = useOrderStore((state) => state.prependOrder);
  const upsertOrder = useOrderStore((state) => state.upsertOrder);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();

    const handleOrderCreated = (order: Order) => {
      prependOrder(order);
    };

    const handleOrderUpdated = (updatedOrder: Order) => {
      upsertOrder(updatedOrder);
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [prependOrder, setOrders, upsertOrder]);
}
