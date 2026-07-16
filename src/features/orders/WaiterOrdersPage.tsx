import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { useOrderStore } from '../../store/orderStore';
import { cn } from '../../utils/cn';
import type { OrderStatus } from '../../types/domain';

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

const getStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
    case 'accepted':
      return 'neutral';
    case 'preparing':
      return 'warning';
    case 'ready':
    case 'served':
    case 'paid':
      return 'success';
    case 'cancelled':
      return 'danger';
  }
};

export function WaiterOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const markOrderServed = useOrderStore((state) => state.markOrderServed);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Active Orders</CardTitle>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Demo orders created from waiter checkout appear here immediately.</p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <tr><Th>Order</Th><Th>Table</Th><Th>Items</Th><Th>Status</Th><Th>Total</Th><Th>Actions</Th></tr>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <tr key={order.id}>
                <Td className="font-medium text-stone-950 dark:text-stone-50">{order.id}</Td>
                <Td>{order.table}</Td>
                <Td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</Td>
                <Td><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></Td>
                <Td>{money(order.total)}</Td>
                <Td>
                  {['accepted', 'preparing', 'ready'].includes(order.status) && (
                    <Button size="sm" variant="outline" onClick={() => markOrderServed(order.id)}>
                      Mark Served
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
