import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'neutral';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-stone-950 text-white dark:bg-white dark:text-stone-950',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  neutral: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200',
};

export function Badge({ className, children, variant = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props}>{children}</span>;
}
