// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type LoginCredentials, type User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
}

const mockUsers: Record<string, User & { password: string }> = {
  'admin@cafe.test': { id: 'u1', name: 'Ava Admin', email: 'admin@cafe.test', password: 'admin123', role: UserRole.Admin },
  'waiter@cafe.test': { id: 'u2', name: 'Maya Waiter', email: 'waiter@cafe.test', password: 'waiter123', role: UserRole.Waiter },
  'chef@cafe.test': { id: 'u3', name: 'Leo Chef', email: 'chef@cafe.test', password: 'chef123', role: UserRole.Chef },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      async login({ email, password }) {
        await new Promise((r) => setTimeout(r, 500));
        const record = mockUsers[email.toLowerCase()];
        if (!record || record.password !== password) {
          throw new Error('Invalid credentials');
        }
        const { password: _password, ...user } = record;
        set({ user });
        return user;
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
