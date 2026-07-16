import { create } from 'zustand';
import { categories } from '../mock/data';
import type { MenuCategory, MenuItem } from '../types/domain';
import { socket } from '../services/socket';
import { useEffect } from 'react';

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
  categories,
  menuItems: [],
  isLoading: false,

  fetchMenu: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/data/menu');
      const data = await response.json();
      set({ categories: data.categories, menuItems: data.items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      set({ isLoading: false });
    }
  },

  addMenuItem: async (item) => {
    try {
      const response = await fetch('/api/data/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const newItem = await response.json();
      get().prependMenuItem(newItem);
      socket.emit('menu:create', item);
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  },

  updateMenuItem: async (id, item) => {
    try {
      const response = await fetch(`/api/data/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const updatedItem = await response.json();
      get().upsertMenuItem({ ...updatedItem, id });
      socket.emit('menu:update', { id, ...item });
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  },

  removeMenuItem: async (id) => {
    try {
      await fetch(`/api/data/menu/${id}`, { method: 'DELETE' });
      get().removeMenuItemById(id);
      socket.emit('menu:delete', id);
    } catch (error) {
      console.error('Failed to remove menu item:', error);
    }
  },

  setAvailability: async (id, available) => {
    try {
      await fetch(`/api/data/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available }),
      });
      const item = get().menuItems.find(i => i.id === id);
      if (item) {
        get().upsertMenuItem({ ...item, available });
      }
      socket.emit('menu:availability', { id, available });
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
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

export function useMenuSocketSync() {
  const { prependMenuItem, upsertMenuItem, removeMenuItemById } = useMenuStore();

  useEffect(() => {
    const handleMenuCreated = (item: MenuItem) => prependMenuItem(item);
    const handleMenuUpdated = (item: MenuItem) => upsertMenuItem(item);
    const handleMenuDeleted = (id: string) => removeMenuItemById(id);
    const handleMenuAvailability = (item: MenuItem) => upsertMenuItem(item);

    socket.on('menu:created', handleMenuCreated);
    socket.on('menu:updated', handleMenuUpdated);
    socket.on('menu:deleted', handleMenuDeleted);
    socket.on('menu:availability:updated', handleMenuAvailability);

    return () => {
      socket.off('menu:created', handleMenuCreated);
      socket.off('menu:updated', handleMenuUpdated);
      socket.off('menu:deleted', handleMenuDeleted);
      socket.off('menu:availability:updated', handleMenuAvailability);
    };
  }, [prependMenuItem, upsertMenuItem, removeMenuItemById]);
}

