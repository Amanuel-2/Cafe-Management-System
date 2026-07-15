import type { ComponentType, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import { Coffee } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  Icon = Coffee,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  Icon?: ComponentType<LucideProps>;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 p-8 text-center dark:border-stone-700">
      <Icon className="mb-3 h-8 w-8 text-stone-400" />
      <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">{description}</p> : null}
      {actionLabel ? <Button className="mt-4" variant="secondary" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
