import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from './Card';

export function StatCard({ label, value, change, Icon = TrendingUp }: { label: string; value: string; change?: string; Icon?: ComponentType<LucideProps> }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950 dark:text-stone-50">{value}</p>
          {change ? <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-300">{change}</p> : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
