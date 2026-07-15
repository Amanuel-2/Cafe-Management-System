import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(({ label, className, ...props }, ref) => (
  <label className="inline-flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
    <input ref={ref} type="checkbox" className={cn('h-4 w-4 rounded border-stone-300 accent-stone-950 dark:border-stone-700 dark:accent-white', className)} {...props} />
    {label}
  </label>
));

Checkbox.displayName = 'Checkbox';
