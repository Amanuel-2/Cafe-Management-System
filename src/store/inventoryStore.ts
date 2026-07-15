import { create } from 'zustand';
import { inventory } from '../mock/data';
import type { InventoryItem } from '../types/domain';

type InventoryState = {
  items: InventoryItem[];
  updateStock: (id: string, stock: number) => void;
};

export const useInventoryStore = create<InventoryState>((set) => ({
  items: inventory,
  updateStock: (id, stock) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, stock } : item)),
    })),
}));
