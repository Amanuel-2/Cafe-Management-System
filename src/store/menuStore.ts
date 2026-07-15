import { create } from 'zustand';
import { categories, menuItems } from '../mock/data';
import type { MenuCategory, MenuItem } from '../types/domain';

type MenuState = {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  setAvailability: (id: string, available: boolean) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  categories,
  menuItems,
  setAvailability: (id, available) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) => (item.id === id ? { ...item, available } : item)),
    })),
}));
