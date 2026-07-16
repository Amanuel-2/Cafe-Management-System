import { ChefHat, ClipboardList, Menu, Timer, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { NotificationPanel } from '../components/common/NotificationPanel';
import { ProfileMenu } from '../components/common/ProfileMenu';
import { ThemeSwitch } from '../components/common/ThemeSwitch';
import { cn } from '../utils/cn';

const navItems = [
  { label: 'Kitchen', to: '/chef', icon: ChefHat },
  { label: 'Queue', to: '/chef/queue', icon: ClipboardList },
  { label: 'Prep', to: '/chef/prep', icon: Timer },
];

export function ChefLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 border-r border-stone-800 bg-stone-950 p-4">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Kitchen Display</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-stone-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/chef'} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-stone-900', isActive && 'bg-white text-stone-950')}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-800 bg-stone-950 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Hamburger Button */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-stone-800 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Kitchen Display</h1>
          <nav className="hidden gap-2 md:flex">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/chef'} className={({ isActive }) => cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-stone-900', isActive && 'bg-white text-stone-950')}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2"><NotificationPanel /><ThemeSwitch /><ProfileMenu /></div>
      </header>
      <main className="p-4 md:p-6"><Outlet /></main>
    </div>
  );
}
