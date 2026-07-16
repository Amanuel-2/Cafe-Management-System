import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { useOrderStore } from '../../store/orderStore';

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function WaiterOrdersPage() {
  const orders = useOrderStore((state) => state.orders);

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
            <tr><Th>Order</Th><Th>Table</Th><Th>Items</Th><Th>Status</Th><Th>Total</Th></tr>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <tr key={order.id}>
                <Td className="font-medium text-stone-950 dark:text-stone-50">{order.id}</Td>
                <Td>{order.table}</Td>
                <Td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</Td>
                <Td><Badge variant={order.status === 'ready' ? 'success' : 'warning'}>{order.status}</Badge></Td>
                <Td>{money(order.total)}</Td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
