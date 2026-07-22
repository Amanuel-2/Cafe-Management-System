import { create } from 'zustand';
import { orderService } from '../services/orderService';
import type { ItemStatus, Order, OrderStatus, PaymentMethod } from '../types/domain';

type OrderState = {
  orders: Order[];
  refresh: () => void;
  setOrders: (orders: Order[]) => void;
  prependOrder: (order: Order) => void;
  upsertOrder: (order: Order) => void;
  addOrder: (order: { tableId: string; table: string; waiterName: string; items: Order['items'] }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, collectedBy?: string) => void;
  updateItemStatus: (orderId: string, itemId: string, status: ItemStatus) => void;
  acceptOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
  requestBill: (orderId: string) => void;
  markOrderPaid: (orderId: string, paymentMethod: PaymentMethod, collectedBy?: string) => void;
  cancelOrder: (orderId: string) => void;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: orderService.list() as Order[],
  refresh: () => set({ orders: orderService.list() as Order[] }),
  setOrders: (orders) => set({ orders }),
  prependOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  upsertOrder: (order) => set((state) => ({ orders: state.orders.some((entry) => entry.id === order.id) ? state.orders.map((entry) => entry.id === order.id ? order : entry) : [order, ...state.orders] })),
  addOrder: async (values) => {
    const order = orderService.create(values, { name: values.waiterName }) as Order;
    get().prependOrder(order);
    return order;
  },
  updateOrderStatus: (id, status) => { const order = orderService.transition(id, status, undefined) as Order; get().upsertOrder(order); },
  updateItemStatus: (orderId, itemId, status) => { const order = orderService.updateItemStatus(orderId, itemId, status, undefined) as Order; get().upsertOrder(order); },
  acceptOrder: (id) => get().updateOrderStatus(id, 'preparing'),
  markOrderReady: (id) => get().updateOrderStatus(id, 'ready'),
  markOrderServed: (id) => get().updateOrderStatus(id, 'served'),
  requestBill: (id) => { const order = orderService.requestBill(id, undefined) as Order; get().upsertOrder(order); },
  markOrderPaid: (id, method, collectedBy) => { const order = orderService.markPaid(id, method, { name: collectedBy ?? 'Cashier' }) as Order; get().upsertOrder(order); },
  cancelOrder: (id) => get().updateOrderStatus(id, 'cancelled'),
}));
