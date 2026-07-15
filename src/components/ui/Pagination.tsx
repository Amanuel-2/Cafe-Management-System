import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-stone-500 dark:text-stone-400">
      <span>Page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <Button size="icon" variant="outline" Icon={ChevronLeft} disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page" />
        <Button size="icon" variant="outline" Icon={ChevronRight} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page" />
      </div>
    </div>
  );
}
