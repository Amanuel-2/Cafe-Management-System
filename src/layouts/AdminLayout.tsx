import { BarChart3, Boxes, ChefHat, ClipboardList, LayoutDashboard, Menu, Settings, ShoppingBag, Truck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { NotificationPanel } from '../components/common/NotificationPanel';
import { ProfileMenu } from '../components/common/ProfileMenu';
import { ThemeSwitch } from '../components/common/ThemeSwitch';
import { cn } from '../utils/cn';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Menu', to: '/admin/menu', icon: ShoppingBag },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Employees', to: '/admin/employees', icon: Users },
  { label: 'Recipes', to: '/admin/recipes', icon: ChefHat },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Suppliers', to: '/admin/suppliers', icon: Truck },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const crumbs = location.pathname.split('/').filter(Boolean);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950 lg:block">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-950 text-white dark:bg-white dark:text-stone-950">CM</div>
          <div>
            <p className="font-semibold">Cafe Manager</p>
            <p className="text-xs text-stone-500">Admin console</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900', isActive && 'bg-stone-950 text-white hover:bg-stone-950 dark:bg-white dark:text-stone-950 dark:hover:bg-white')}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          {/* Sidebar Content */}
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-stone-950 text-white dark:bg-white dark:text-stone-950">CM</div>
                <div>
                  <p className="font-semibold">Cafe Manager</p>
                  <p className="text-xs text-stone-500">Admin console</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/admin'} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900', isActive && 'bg-stone-950 text-white hover:bg-stone-950 dark:bg-white dark:text-stone-950 dark:hover:bg-white')}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs capitalize text-stone-500 dark:text-stone-400">{crumbs.join(' / ') || 'admin'}</p>
              <h1 className="text-lg font-semibold">Operations</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <ThemeSwitch />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
