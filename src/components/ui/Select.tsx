import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ label: string; value: string }>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, className, id, ...props }, ref) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <label htmlFor={selectId} className="text-sm font-medium text-stone-800 dark:text-stone-100">{label}</label> : null}
      <select ref={ref} id={selectId} className={cn('h-10 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-950 outline-none focus:ring-2 focus:ring-stone-200 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-50', className)} {...props}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
});

Select.displayName = 'Select';
