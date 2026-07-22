import { create } from 'zustand';
import type { MenuCategory, MenuItem } from '../types/domain';
import { menuService } from '../services/menuService';

type MenuState = {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  isLoading: boolean;
  fetchMenu: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id'>) => Promise<void>;
  removeMenuItem: (id: string) => Promise<void>;
  setAvailability: (id: string, available: boolean) => Promise<void>;
  prependMenuItem: (item: MenuItem) => void;
  upsertMenuItem: (item: MenuItem) => void;
  removeMenuItemById: (id: string) => void;
};

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: menuService.listCategories(),
  menuItems: menuService.list(),
  isLoading: false,

  fetchMenu: async () => {
    set({ isLoading: true });
    set({ categories: menuService.listCategories(), menuItems: menuService.list(), isLoading: false });
  },

  addMenuItem: async (item) => {
    const newItem = menuService.create(item);
    get().prependMenuItem(newItem);
  },

  updateMenuItem: async (id, item) => {
    const updatedItem = menuService.update(id, item);
    if (updatedItem) get().upsertMenuItem(updatedItem);
  },

  removeMenuItem: async (id) => {
    if (menuService.remove(id)) {
      get().removeMenuItemById(id);
    }
  },

  setAvailability: async (id, available) => {
    const item = menuService.update(id, { available });
    if (item) get().upsertMenuItem(item);
  },

  prependMenuItem: (item) =>
    set((state) => ({
      menuItems: [item, ...state.menuItems],
    })),

  upsertMenuItem: (item) =>
    set((state) => ({
      menuItems: state.menuItems.map((menuItem) => (menuItem.id === item.id ? item : menuItem)),
    })),

  removeMenuItemById: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id),
    })),
}));

