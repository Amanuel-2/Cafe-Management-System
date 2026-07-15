import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useOrderStore } from '../../store/orderStore';
import type { OrderStatus } from '../../types/domain';

const lanes: Array<{ title: string; status: OrderStatus }> = [
  { title: 'Pending', status: 'pending' },
  { title: 'Preparing', status: 'preparing' },
  { title: 'Ready', status: 'ready' },
];

export function ChefDashboard() {
  const { orders, updateOrderStatus } = useOrderStore();

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {lanes.map((lane) => (
        <section key={lane.status} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{lane.title}</h2>
            <Badge>{orders.filter((order) => order.status === lane.status).length}</Badge>
          </div>
          {orders.filter((order) => order.status === lane.status).map((order) => (
            <Card key={order.id} className="border-stone-800 bg-stone-900 p-4 text-white">
              <div className="flex items-center justify-between">
                <div><p className="text-2xl font-semibold">{order.table}</p><p className="text-sm text-stone-400">{order.id}</p></div>
                <Badge variant="warning">{order.items.length} items</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-lg bg-stone-800 p-3">
                    <p className="font-semibold">{item.quantity}x {item.name}</p>
                    {item.notes ? <p className="mt-1 text-sm text-amber-200">{item.notes}</p> : null}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {lane.status !== 'preparing' ? <Button variant="secondary" onClick={() => updateOrderStatus(order.id, 'preparing')}>Preparing</Button> : null}
                {lane.status !== 'ready' ? <Button onClick={() => updateOrderStatus(order.id, 'ready')}>Ready</Button> : null}
              </div>
            </Card>
          ))}
        </section>
      ))}
    </div>
  );
}
