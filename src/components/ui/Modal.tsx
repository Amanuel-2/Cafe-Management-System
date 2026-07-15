import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl dark:bg-stone-950">
        <div className="flex items-center justify-between border-b border-stone-200 p-4 dark:border-stone-800">
          <h2 className="font-semibold text-stone-950 dark:text-stone-50">{title}</h2>
          <Button size="icon" variant="ghost" Icon={X} onClick={onClose} aria-label="Close" />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
