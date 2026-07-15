import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-stone-200 dark:bg-stone-800', className)} {...props} />;
}
