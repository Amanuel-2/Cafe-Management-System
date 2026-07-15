import { ChefHat, ClipboardList, Timer } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-800 bg-stone-950 px-4 md:px-6">
        <div className="flex items-center gap-4">
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
