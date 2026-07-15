import { create } from 'zustand';
import { orders as initialOrders } from '../mock/data';
import type { ItemStatus, Order, OrderStatus } from '../types/domain';

type OrderState = {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: initialOrders,
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
}));
