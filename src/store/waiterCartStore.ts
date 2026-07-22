import { create } from 'zustand';
import type { MenuItem, OrderItem } from '../types/domain';

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
};

type WaiterCartState = {
  table: string;
  items: CartItem[];
  setTable: (table: string) => void;
  addItem: (item: MenuItem) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;
};

export const useWaiterCartStore = create<WaiterCartState>((set) => ({
  table: 'table-01',
  items: [],
  setTable: (table) => set({ table }),
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.menuItemId === item.id);
      if (existing) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
          },
        ],
      };
    }),
  incrementItem: (menuItemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  decrementItem: (menuItemId) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),
  removeItem: (menuItemId) => set((state) => ({ items: state.items.filter((item) => item.menuItemId !== menuItemId) })),
  updateNotes: (menuItemId, notes) =>
    set((state) => ({
      items: state.items.map((item) => (item.menuItemId === menuItemId ? { ...item, notes } : item)),
    })),
  clearCart: () => set({ items: [], table: 'table-01' }),
}));

export function mapCartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    id: `oi-${item.menuItemId}-${Date.now()}`,
    menuItemId: item.menuItemId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    notes: item.notes,
    status: 'pending',
  }));
}
