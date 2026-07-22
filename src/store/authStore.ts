// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type LoginCredentials, type User, UserRole } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      async login({ email, password }) {
        const user = await authService.login({ email, password });
        set({ user });
        return user as User;
      },
      logout() {
        set({ user: null });
      },
    }),
    { 
      name: 'auth-store', 
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
        // Disable cross-tab synchronization by making subscribe a no-op
        subscribe: () => () => {},
      }
    }
  )
);
