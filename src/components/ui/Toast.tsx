import { CheckCircle2 } from 'lucide-react';

export function Toast({ title, description }: { title: string; description?: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-lg dark:border-stone-800 dark:bg-stone-950">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      <div>
        <p className="text-sm font-semibold text-stone-950 dark:text-stone-50">{title}</p>
        {description ? <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p> : null}
      </div>
    </div>
  );
}
