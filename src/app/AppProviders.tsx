import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useOrderSocketSync } from '../store/orderStore';

const queryClient = new QueryClient();

function ThemeEffect() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return null;
}

function OrderSocketSync() {
  useOrderSocketSync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeEffect />
      <OrderSocketSync />
      {children}
    </QueryClientProvider>
  );
}
