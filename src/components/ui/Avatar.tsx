import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn('grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-stone-200 text-sm font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-100', className)}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials || <User className="h-4 w-4" />}
    </div>
  );
}
