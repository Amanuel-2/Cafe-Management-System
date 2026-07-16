import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { useOrderStore } from '../../store/orderStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { useAuthStore } from '../../store/authStore';
import { getOrdersInRange, getTotalRevenue, getTotalOrders } from '../../utils/analytics';
import { formatETB } from '../../utils/currency';
import type { OrderStatus } from '../../types/domain';

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

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
          <Icon className="w-5 h-5 text-stone-700 dark:text-stone-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-stone-500 dark:text-stone-400">{title}</p>
          <p className="text-xl font-bold text-stone-900 dark:text-white">{value}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

export function WaiterOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const { markOrderServed } = useOrderStore();
  const { dateRange } = useAnalyticsStore();
  const user = useAuthStore((state) => state.user);

  const filteredOrders = useMemo(
    () => getOrdersInRange(orders, dateRange.start, dateRange.end),
    [orders, dateRange]
  );

  const myOrders = useMemo(() => {
    return user ? filteredOrders.filter((o) => o.waiterName === user.name) : filteredOrders;
  }, [filteredOrders, user]);

  const stats = useMemo(() => {
    return {
      totalOrders: getTotalOrders(myOrders),
      totalRevenue: getTotalRevenue(myOrders),
      servedOrders: myOrders.filter((o) => o.status === 'served' || o.status === 'paid').length,
      pendingOrders: myOrders.filter((o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready').length,
    };
  }, [myOrders]);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">My Dashboard</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">View your orders and performance</p>
        </div>
        <div className="w-full md:w-auto">
          <DateRangePicker />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
        />
        <StatCard
          title="Total Revenue"
          value={formatETB(stats.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Served Orders"
          value={stats.servedOrders}
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
        />
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Order</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Table</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Items</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Status</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Total</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <td className="p-4 font-medium text-stone-950 dark:text-stone-50">{order.id}</td>
                  <td className="p-4">{order.table}</td>
                  <td className="p-4">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="p-4">
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="p-4">{formatETB(order.total)}</td>
                  <td className="p-4">
                    {['accepted', 'preparing', 'ready'].includes(order.status) && (
                      <Button size="sm" variant="outline" onClick={() => markOrderServed(order.id)}>
                        Mark Served
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
