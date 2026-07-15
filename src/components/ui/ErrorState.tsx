import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ title = 'Something went wrong', description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
          {onRetry ? <Button className="mt-4" variant="danger" onClick={onRetry}>Retry</Button> : null}
        </div>
      </div>
    </div>
  );
}
