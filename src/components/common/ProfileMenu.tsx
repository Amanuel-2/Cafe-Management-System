import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

export function ProfileMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Dropdown trigger={<button className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-stone-100 dark:hover:bg-stone-900"><Avatar name={user.name} /><span className="hidden text-sm font-medium text-stone-800 dark:text-stone-100 md:block">{user.name}</span></button>}>
      <div className="p-1">
        <div className="px-3 py-2 text-xs text-stone-500 dark:text-stone-400">
          <p className="font-medium text-stone-900 dark:text-stone-100">{user.email}</p>
          <p className="capitalize">{user.role}</p>
        </div>
        <Button className="w-full justify-start" variant="ghost" Icon={UserCircle}>Profile</Button>
        <Button className="w-full justify-start" variant="ghost" Icon={LogOut} onClick={logout}>Sign out</Button>
      </div>
    </Dropdown>
  );
}
