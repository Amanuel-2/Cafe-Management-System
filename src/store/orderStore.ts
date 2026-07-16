import { create } from 'zustand';
import { socket } from '../services/socket';
import type { ItemStatus, Order, OrderStatus, PaymentMethod } from '../types/domain';
import { useEffect } from 'react';

type OrderState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'receiptNumber' | 'subtotal' | 'tax' | 'discount' | 'total' | 'status' | 'paymentStatus'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, collectedBy?: string) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  acceptOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
  markOrderPaid: (orderId: string, paymentMethod: PaymentMethod, collectedBy?: string) => void;
  cancelOrder: (orderId: string) => void;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),

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
    socket.emit('order:update', { id: orderId, status: 'accepted' });
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
  const { setOrders } = useOrderStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3003/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();

    const handleOrderCreated = (order: Order) => {
      setOrders(prev => [order, ...prev]);
    };

    const handleOrderUpdated = (updatedOrder: Order) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [setOrders]);
}
