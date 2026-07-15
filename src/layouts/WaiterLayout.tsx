import { ClipboardList, Grid3X3, Home, ReceiptText } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { ProfileMenu } from '../components/common/ProfileMenu';
import { ThemeSwitch } from '../components/common/ThemeSwitch';
import { cn } from '../utils/cn';

const navItems = [
  { label: 'Floor', to: '/waiter', icon: Home },
  { label: 'Menu', to: '/waiter/menu', icon: Grid3X3 },
  { label: 'Orders', to: '/waiter/orders', icon: ClipboardList },
  { label: 'Checkout', to: '/waiter/checkout', icon: ReceiptText },
];

export function WaiterLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 dark:border-stone-800 dark:bg-stone-950">
        <h1 className="text-lg font-semibold">Waiter Station</h1>
        <div className="flex items-center gap-2"><ThemeSwitch /><ProfileMenu /></div>
      </header>
      <div className="grid lg:grid-cols-[112px_1fr]">
        <aside className="sticky top-16 z-10 border-b border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
          <nav className="grid grid-cols-4 gap-2 lg:grid-cols-1">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/waiter'} className={({ isActive }) => cn('flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900', isActive && 'bg-stone-950 text-white dark:bg-white dark:text-stone-950')}>
                <Icon className="h-6 w-6" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
