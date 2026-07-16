import { CreditCard, Minus, Plus, ReceiptText, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { mapCartItemsToOrderItems, useWaiterCartStore } from '../../store/waiterCartStore';
import { useState } from 'react';
import { useOrderSocketSync } from '../../store/orderStore';

const tableOptions = Array.from({ length: 12 }, (_, index) => {
  const table = `T-${String(index + 1).padStart(2, '0')}`;
  return { label: table, value: table };
});

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function WaiterCheckoutPage() {
  useOrderSocketSync();
  const user = useAuthStore((state) => state.user);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { table, items, setTable, incrementItem, decrementItem, removeItem, updateNotes, clearCart } = useWaiterCartStore();
  const [toast, setToast] = useState('');
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const serviceFee = subtotal * 0.08;
  const total = subtotal + serviceFee;

  const submitOrder = async () => {
    const order = await addOrder({
      table,
      waiterName: user?.name ?? 'Demo Waiter',
      items: mapCartItemsToOrderItems(items),
    });
    clearCart();
    setToast(`${order.id} sent to kitchen`);
    window.setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Checkout</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Demo checkout creates a pending order and sends it to the shared order queue.</p>
        </div>

        {items.length === 0 ? (
          <EmptyState title="No items selected" description="Use the Menu tab to add food cards to this order." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.menuItemId}>
                <CardContent className="grid gap-4 p-4 md:grid-cols-[72px_1fr_auto] md:items-start">
                  <img src={item.image} alt={item.name} className="h-18 w-18 rounded-lg object-cover" />
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-stone-950 dark:text-stone-50">{item.name}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{money(item.price)} each</p>
                    </div>
                    <Textarea
                      value={item.notes ?? ''}
                      onChange={(event) => updateNotes(item.menuItemId, event.target.value)}
                      placeholder="Kitchen notes"
                      className="min-h-16"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" Icon={Minus} onClick={() => decrementItem(item.menuItemId)} aria-label={`Reduce ${item.name}`} />
                      <span className="grid h-10 min-w-10 place-items-center rounded-lg bg-stone-100 font-semibold dark:bg-stone-800">{item.quantity}</span>
                      <Button size="icon" variant="outline" Icon={Plus} onClick={() => incrementItem(item.menuItemId)} aria-label={`Add ${item.name}`} />
                    </div>
                    <Button size="icon" variant="ghost" Icon={Trash2} onClick={() => removeItem(item.menuItemId)} aria-label={`Remove ${item.name}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select label="Table" value={table} onChange={(event) => setTable(event.target.value)} options={tableOptions} />
            <Input label="Payment method" value="Demo card ending 4242" readOnly />
            <div className="space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-stone-800">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span>Service demo</span><span>{money(serviceFee)}</span></div>
              <div className="flex justify-between text-lg font-semibold text-stone-950 dark:text-stone-50"><span>Total</span><span>{money(total)}</span></div>
            </div>
            <Button className="w-full" size="lg" Icon={CreditCard} disabled={items.length === 0} onClick={submitOrder}>Place demo order</Button>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ReceiptText className="h-5 w-5 text-stone-500" />
            <div>
              <p className="font-medium text-stone-950 dark:text-stone-50">Grouped ticket</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">{items.length} unique items selected</p>
            </div>
            <Badge className="ml-auto">{items.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
          </div>
        </Card>
      </aside>
      {toast ? <Toast title={toast} description="The order is now visible in active orders and the kitchen queue." /> : null}
    </div>
  );
}
