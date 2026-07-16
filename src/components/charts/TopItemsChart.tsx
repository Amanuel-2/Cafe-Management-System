import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface TopItemsChartProps {
  data: Array<{ name: string; quantity: number }>;
}

export function TopItemsChart({ data }: TopItemsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="quantity" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
