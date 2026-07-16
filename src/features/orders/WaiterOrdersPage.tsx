import { useState, useMemo } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { DatePicker } from '../../components/ui/DatePicker';
import { XCircle } from 'lucide-react';
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

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export function WaiterOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const markOrderServed = useOrderStore((state) => state.markOrderServed);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesDate = !selectedDate || isSameDay(new Date(order.createdAt), selectedDate);
      return matchesDate;
    });
  }, [orders, selectedDate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <CardTitle>Active Orders</CardTitle>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Demo orders created from waiter checkout appear here immediately.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-64">
              <DatePicker selected={selectedDate} onChange={setSelectedDate} />
            </div>
            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(undefined)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <tr><Th>Order</Th><Th>Table</Th><Th>Items</Th><Th>Status</Th><Th>Total</Th><Th>Actions</Th></tr>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
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
