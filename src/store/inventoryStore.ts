import { create } from 'zustand';
import { inventoryService } from '../services/inventoryService';
import type { InventoryItem } from '../types/domain';

type InventoryState = {
  items: InventoryItem[];
  updateStock: (id: string, stock: number) => void;
};

export const useInventoryStore = create<InventoryState>((set) => ({
  items: inventoryService.list(),
  updateStock: (id, stock) => {
    const updated = inventoryService.updateStock(id, stock);
    if (!updated) return;
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updated : item)),
    }));
  },
}));
