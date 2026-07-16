import { create } from 'zustand';
import { categories, menuItems } from '../mock/data';
import type { MenuCategory, MenuItem } from '../types/domain';

type MenuState = {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (id: string) => void;
  setAvailability: (id: string, available: boolean) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  categories,
  menuItems,
  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [{ ...item, id: `m${Date.now()}` }, ...state.menuItems],
    })),
  updateMenuItem: (id, item) =>
    set((state) => ({
      menuItems: state.menuItems.map((menuItem) => (menuItem.id === id ? { ...item, id } : menuItem)),
    })),
  removeMenuItem: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id),
    })),
  setAvailability: (id, available) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) => (item.id === id ? { ...item, available } : item)),
    })),
}));
