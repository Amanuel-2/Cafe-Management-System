import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  ChefHat,
  CheckCircle,
  CreditCard,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { OrdersChart } from '../../components/charts/OrdersChart';
import { TopItemsChart } from '../../components/charts/TopItemsChart';
import { useOrderStore } from '../../store/orderStore';
import { useAnalyticsStore } from '../../store/analyticsStore';
import {
  getOrdersInRange,
  getTotalRevenue,
  getTotalOrders,
  getAverageOrderValue,
  getTopSellingItems,
  getOrdersByHour,
  getWaiterStats,
} from '../../utils/analytics';
import { formatETB } from '../../utils/currency';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: string; isPositive: boolean };
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
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  </motion.div>
);

export function OrderManagementPage() {
  const orders = useOrderStore((state) => state.orders);
  const { dateRange } = useAnalyticsStore();
  const [showAllOrders, setShowAllOrders] = useState(false);

  const filteredOrders = useMemo(
    () => getOrdersInRange(orders, dateRange.start, dateRange.end),
    [orders, dateRange]
  );

  const stats = useMemo(() => {
    return {
      totalRevenue: getTotalRevenue(filteredOrders),
      totalOrders: getTotalOrders(filteredOrders),
      avgOrderValue: getAverageOrderValue(filteredOrders),
      paidOrders: filteredOrders.filter((o) => o.paymentStatus === 'paid').length,
      cancelledOrders: filteredOrders.filter((o) => o.status === 'cancelled').length,
      pendingOrders: filteredOrders.filter((o) => o.status === 'pending').length,
      preparingOrders: filteredOrders.filter((o) => o.status === 'preparing').length,
    };
  }, [filteredOrders]);

  const topItems = useMemo(() => getTopSellingItems(filteredOrders).slice(0, 10), [filteredOrders]);
  const ordersByHour = useMemo(() => getOrdersByHour(filteredOrders), [filteredOrders]);
  const waiterStats = useMemo(() => getWaiterStats(filteredOrders), [filteredOrders]);

  const chartData = useMemo(() => {
    // Generate chart data based on date range type
    if (dateRange.type === 'today' || dateRange.type === 'yesterday') {
      return ordersByHour.map((item) => ({ name: item.hour, revenue: 0, orders: item.count }));
    }
    // For week/month/year, just use simple data for now
    return [
      { name: 'Mon', revenue: 1200, orders: 15 },
      { name: 'Tue', revenue: 1800, orders: 22 },
      { name: 'Wed', revenue: 900, orders: 12 },
      { name: 'Thu', revenue: 2100, orders: 28 },
      { name: 'Fri', revenue: 2500, orders: 32 },
      { name: 'Sat', revenue: 3000, orders: 40 },
      { name: 'Sun', revenue: 1500, orders: 18 },
    ];
  }, [dateRange, ordersByHour]);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            View business performance for your selected period
          </p>
        </div>
        <div className="w-full md:w-auto">
          <DateRangePicker />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatETB(stats.totalRevenue)}
          icon={DollarSign}
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={{ value: '+8%', isPositive: true }}
        />
        <StatCard
          title="Avg. Order Value"
          value={formatETB(stats.avgOrderValue)}
          icon={CreditCard}
          trend={{ value: '+5%', isPositive: true }}
        />
        <StatCard
          title="Paid Orders"
          value={stats.paidOrders}
          icon={CheckCircle}
        />
      </div>

      {/* More Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
        />
        <StatCard
          title="Preparing Orders"
          value={stats.preparingOrders}
          icon={ChefHat}
        />
        <StatCard
          title="Cancelled Orders"
          value={stats.cancelledOrders}
          icon={XCircle}
        />
        <StatCard
          title="Active Waiters"
          value={waiterStats.length}
          icon={Users}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={chartData} />
        <OrdersChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopItemsChart data={topItems} />
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {waiterStats.slice(0, 5).map((waiter, index) => (
              <div key={waiter.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 font-semibold">
                    {waiter.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">{waiter.name}</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{waiter.orders} orders</p>
                  </div>
                </div>
                <p className="font-semibold text-stone-900 dark:text-white">{formatETB(waiter.revenue)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Orders List Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Orders</h2>
        <Button variant="outline" onClick={() => setShowAllOrders(!showAllOrders)}>
          {showAllOrders ? 'Hide Orders' : 'Show All Orders'}
        </Button>
      </div>

      {/* Orders List (Conditional) */}
      {showAllOrders && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Table</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Waiter</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Items</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Total</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Status</th>
                  <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-semibold text-stone-900 dark:text-white">{order.id}</span>
                    </td>
                    <td className="p-4 text-stone-500 dark:text-stone-400">{order.table}</td>
                    <td className="p-4 text-stone-500 dark:text-stone-400">{order.waiterName}</td>
                    <td className="p-4 text-stone-500 dark:text-stone-400">{order.items.length}</td>
                    <td className="p-4 font-semibold text-stone-900 dark:text-white">{formatETB(order.total)}</td>
                    <td className="p-4">{order.status}</td>
                    <td className="p-4">{order.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
