import { store } from '../store';
import type { MenuItem } from '../types';

export const menuService = {
  getAllItems(): MenuItem[] {
    return store.menuItems;
  },

  addItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `m${Date.now()}`,
    };
    store.menuItems.unshift(newItem);
    return newItem;
  },

  updateItem(id: string, data: Omit<MenuItem, 'id'>): MenuItem | null {
    const index = store.menuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      store.menuItems[index] = { ...data, id };
      return store.menuItems[index];
    }
    return null;
  },

  removeItem(id: string): boolean {
    const initialLength = store.menuItems.length;
    store.menuItems = store.menuItems.filter((item) => item.id !== id);
    return store.menuItems.length !== initialLength;
  },

  setAvailability(id: string, available: boolean): MenuItem | null {
    const item = store.menuItems.find((item) => item.id === id);
    if (item) {
      item.available = available;
      return item;
    }
    return null;
  },
};
