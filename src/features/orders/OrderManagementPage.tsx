import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  DollarSign,
  Clock,
  ChefHat,
  CheckCircle,
  CreditCard,
  XCircle,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Receipt,
  Printer,
  Download,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Drawer } from '../../components/ui/Drawer';
import { Select } from '../../components/ui/Select';
import { orders } from '../../mock/data';
import type { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../../types/domain';
import { cn } from '../../utils/cn';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatusVariant = (status: OrderStatus | PaymentStatus): 'success' | 'warning' | 'neutral' | 'danger' => {
  switch (status) {
    case 'pending':
    case 'unpaid':
      return 'neutral';
    case 'accepted':
    case 'preparing':
      return 'warning';
    case 'ready':
    case 'served':
    case 'paid':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
};

const getStatusLabel = (status: string): string => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const SUMMARY_ICONS = [
  { icon: ShoppingBag, label: 'Total Orders Today', key: 'totalOrders' },
  { icon: DollarSign, label: "Today's Revenue", key: 'todayRevenue' },
  { icon: Clock, label: 'Pending Orders', key: 'pendingOrders' },
  { icon: ChefHat, label: 'Preparing Orders', key: 'preparingOrders' },
  { icon: CheckCircle, label: 'Ready Orders', key: 'readyOrders' },
  { icon: Receipt, label: 'Served Orders', key: 'servedOrders' },
  { icon: CreditCard, label: 'Paid Orders', key: 'paidOrders' },
  { icon: XCircle, label: 'Cancelled Orders', key: 'cancelledOrders' },
];

export function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [waiterFilter, setWaiterFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const waiters = useMemo(() => {
    const uniqueWaiters = new Set(orders.map(o => o.waiterName));
    return Array.from(uniqueWaiters);
  }, []);

  const summaryStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);

    return {
      totalOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      readyOrders: orders.filter(o => o.status === 'ready').length,
      servedOrders: orders.filter(o => o.status === 'served').length,
      paidOrders: orders.filter(o => o.paymentStatus === 'paid').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        !searchQuery ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.waiterName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter;
      const matchesPaymentMethod = paymentMethodFilter === 'all' || order.paymentMethod === paymentMethodFilter;
      const matchesWaiter = waiterFilter === 'all' || order.waiterName === waiterFilter;

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod && matchesWaiter;
    });
  }, [searchQuery, statusFilter, paymentStatusFilter, paymentMethodFilter, waiterFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Order Management</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Monitor and manage all orders in the system</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_ICONS.map(({ icon: Icon, label, key }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                  <Icon className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
                  <p className="text-xl font-bold text-stone-900 dark:text-white">
                    {key.includes('Revenue')
                      ? formatCurrency(summaryStats[key as keyof typeof summaryStats])
                      : summaryStats[key as keyof typeof summaryStats]}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <Input
              placeholder="Search orders, receipts, waiters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Accepted', value: 'accepted' },
                { label: 'Preparing', value: 'preparing' },
                { label: 'Ready', value: 'ready' },
                { label: 'Served', value: 'served' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <Select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              options={[
                { label: 'Payment Status', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Unpaid', value: 'unpaid' },
              ]}
            />
            <Select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              options={[
                { label: 'Payment Method', value: 'all' },
                { label: 'Cash', value: 'cash' },
                { label: 'Telebirr', value: 'telebirr' },
                { label: 'CBE Birr', value: 'cbe_birr' },
                { label: 'Dashen', value: 'dashen' },
                { label: 'Bank Transfer', value: 'bank_transfer' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="hidden md:block overflow-x-auto">
        <Card>
          <table className="w-full text-left">
            <thead className="border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Order ID</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Created</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Waiter</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Items</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Total</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Status</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Payment</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Last Updated</th>
                <th className="p-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-semibold text-stone-900 dark:text-white">{order.id}</span>
                  </td>
                  <td className="p-4 text-stone-500 dark:text-stone-400">
                    {formatTime(order.createdAt)}
                  </td>
                  <td className="p-4 text-stone-500 dark:text-stone-400">
                    {order.waiterName}
                  </td>
                  <td className="p-4 text-stone-500 dark:text-stone-400">
                    {order.items.length}
                  </td>
                  <td className="p-4 font-semibold text-stone-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusVariant(order.paymentStatus)}>
                      {getStatusLabel(order.paymentStatus)}
                    </Badge>
                  </td>
                  <td className="p-4 text-stone-500 dark:text-stone-400">
                    {formatTime(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="md:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-stone-900 dark:text-white">{order.id}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={getStatusVariant(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400 mb-3">
              <span>Waiter: {order.waiterName}</span>
              <span>Total: {formatCurrency(order.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={getStatusVariant(order.paymentStatus)}>
                {getStatusLabel(order.paymentStatus)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(order)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500 dark:text-stone-400">
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <Drawer
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{selectedOrder.id}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Card className="mb-6 p-4">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Receipt Number</p>
                    <p className="font-medium text-stone-900 dark:text-white">{selectedOrder.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Created</p>
                    <p className="font-medium text-stone-900 dark:text-white">{formatTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Waiter</p>
                    <p className="font-medium text-stone-900 dark:text-white">{selectedOrder.waiterName}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Status</p>
                    <Badge variant={getStatusVariant(selectedOrder.status)}>{getStatusLabel(selectedOrder.status)}</Badge>
                  </div>
                </div>
              </Card>

              <Card className="mb-6 p-4">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">Ordered Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-stone-900 dark:text-white">{item.quantity} × {item.name}</p>
                          <p className="font-semibold text-stone-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mb-6 p-4">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          event.completed ? "bg-green-500" : "bg-stone-300"
                        )} />
                        {index < selectedOrder.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-stone-200 dark:bg-stone-800" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{event.title}</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400">{formatTime(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="mb-6 p-4">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Payment Method</p>
                    <p className="font-medium text-stone-900 dark:text-white">{getStatusLabel(selectedOrder.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 dark:text-stone-400">Payment Status</p>
                    <Badge variant={getStatusVariant(selectedOrder.paymentStatus)}>{getStatusLabel(selectedOrder.paymentStatus)}</Badge>
                  </div>
                  {selectedOrder.paidAt && (
                    <div>
                      <p className="text-stone-500 dark:text-stone-400">Paid At</p>
                      <p className="font-medium text-stone-900 dark:text-white">{formatTime(selectedOrder.paidAt)}</p>
                    </div>
                  )}
                  {selectedOrder.collectedBy && (
                    <div>
                      <p className="text-stone-500 dark:text-stone-400">Collected By</p>
                      <p className="font-medium text-stone-900 dark:text-white">{selectedOrder.collectedBy}</p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="mb-6 p-4">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Tax</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-stone-400">Discount</span>
                      <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-stone-200 dark:border-stone-800 pt-2 flex justify-between">
                    <span className="font-semibold text-stone-900 dark:text-white">Total</span>
                    <span className="font-bold text-xl text-stone-900 dark:text-white">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-2">
                <Button className="w-full" variant="primary">
                  View Order
                </Button>
                {selectedOrder.paymentStatus === 'unpaid' && (
                  <Button className="w-full" variant="primary">
                    Mark as Paid
                  </Button>
                )}
                {selectedOrder.status !== 'cancelled' && (
                  <Button className="w-full" variant="danger">
                    Cancel Order
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </div>
  );
}
