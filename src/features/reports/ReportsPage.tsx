import { BarChart3, TrendingUp, TrendingDown, DollarSign, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { reports } from '../../mock/data';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Reports</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Analyze sales, product mix, labor, and operational trends.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <StatCard
            key={report.id}
            label={report.label}
            value={report.value}
            change={report.change}
            Icon={report.trend === 'up' ? TrendingUp : TrendingDown}
          />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <DollarSign className="h-20 w-20 text-stone-300" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <ClipboardList className="h-20 w-20 text-stone-300" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}