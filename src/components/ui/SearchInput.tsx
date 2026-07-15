import { Search } from 'lucide-react';
import { Input } from './Input';
import type { InputHTMLAttributes } from 'react';

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <Input className="pl-9" placeholder="Search" {...props} />
    </div>
  );
}
