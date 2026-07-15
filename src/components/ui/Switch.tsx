import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Switch({ checked, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn('inline-flex h-6 w-11 items-center rounded-full p-1 transition', checked ? 'bg-stone-950 dark:bg-white' : 'bg-stone-300 dark:bg-stone-700', className)}
      {...props}
    >
      <span className={cn('h-4 w-4 rounded-full bg-white transition dark:bg-stone-950', checked && 'translate-x-5')} />
    </button>
  );
}
