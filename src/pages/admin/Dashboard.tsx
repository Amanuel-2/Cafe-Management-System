import { Boxes, ClipboardList, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { inventory, reports } from '../../mock/data';
import { useOrderStore } from '../../store/orderStore';

export function AdminDashboard() {
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={reports[0].label} value={reports[0].value} change={reports[0].change} Icon={DollarSign} />
        <StatCard label="Open orders" value={String(orders.length)} change="+4 today" Icon={ClipboardList} />
        <StatCard label="Active staff" value="14" change="3 roles" Icon={Users} />
        <StatCard label="Low stock" value={String(inventory.filter((item) => item.stock < item.parLevel).length)} change="Needs review" Icon={Boxes} />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader><CardTitle>Live Orders</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><tr><Th>Order</Th><Th>Table</Th><Th>Status</Th><Th>Total</Th></tr></TableHeader>
              <TableBody>
                {orders.map((order) => <tr key={order.id}><Td>{order.id}</Td><Td>{order.table}</Td><Td className="capitalize">{order.status}</Td><Td>${order.total.toFixed(2)}</Td></tr>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inventory Watch</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-stone-50 p-3 dark:bg-stone-900">
                <div><p className="font-medium">{item.name}</p><p className="text-sm text-stone-500">{item.category}</p></div>
                <p className="text-sm font-semibold">{item.stock} {item.unit}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
