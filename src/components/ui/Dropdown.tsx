import type { ReactNode } from 'react';

export function Dropdown({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <div className="group relative inline-flex">
      {trigger}
      <div className="invisible absolute right-0 top-full z-30 mt-2 min-w-48 rounded-lg border border-stone-200 bg-white p-1 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 dark:border-stone-800 dark:bg-stone-950">
        {children}
      </div>
    </div>
  );
}
