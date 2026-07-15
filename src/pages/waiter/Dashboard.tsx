import { Plus } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMenuStore } from '../../store/menuStore';
import { useOrderStore } from '../../store/orderStore';

export function WaiterDashboard() {
  const { categories, menuItems } = useMenuStore();
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => <button key={category.id} className={`min-h-14 rounded-lg px-5 text-base font-semibold ${category.color}`}>{category.name}</button>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-lg font-semibold">{item.name}</h2><p className="text-sm text-stone-500">{item.prepTimeMinutes} min</p></div>
                  <Badge>${item.price.toFixed(2)}</Badge>
                </div>
                <Button className="mt-4 w-full" size="lg" Icon={Plus}>Add</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <aside className="space-y-3">
        <h2 className="text-lg font-semibold">Active Tables</h2>
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold">{order.table}</p><p className="text-sm text-stone-500">{order.items.length} items</p></div>
              <Badge variant={order.status === 'ready' ? 'success' : 'warning'}>{order.status}</Badge>
            </div>
          </Card>
        ))}
      </aside>
    </div>
  );
}
