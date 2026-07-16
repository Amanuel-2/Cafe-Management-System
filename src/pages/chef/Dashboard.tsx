import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Package,
  Plus,
  Search,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useOrderStore } from '../../store/orderStore';
import type { Order, OrderStatus } from '../../types/domain';
import { cn } from '../../utils/cn';

type Lane = {
  id: OrderStatus | 'served';
  title: string;
  icon: React.ReactNode;
  color: string;
};

const LANES: Lane[] = [
  {
    id: 'pending',
    title: 'Queue',
    icon: <Plus className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    icon: <ChefHat className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  },
  {
    id: 'served',
    title: 'Completed',
    icon: <Package className="w-5 h-5" />,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  },
];

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const calculateElapsedMinutes = (dateStr: string) => {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60));
};

const getPriorityColor = (minutes: number) => {
  if (minutes < 5) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
  if (minutes < 10) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
  if (minutes < 15) return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
  return 'border-red-500 bg-red-50 dark:bg-red-900/20';
};

const getPriorityBadge = (minutes: number) => {
  if (minutes < 5) return { label: 'New', variant: 'success' as const };
  if (minutes < 10) return { label: 'Waiting', variant: 'warning' as const };
  if (minutes < 15) return { label: 'Attention', variant: 'warning' as const };
  return { label: 'Delayed', variant: 'danger' as const };
};

function OrderCard({ order, lane }: { order: Order; lane: Lane }) {
  const [now, setNow] = useState(Date.now());
  const { acceptOrder, updateItemStatus, markOrderServed } = useOrderStore();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsedMinutes = useMemo(() => {
    if (lane.id === 'pending') return calculateElapsedMinutes(order.createdAt);
    if (lane.id === 'preparing' && order.acceptedAt) return calculateElapsedMinutes(order.acceptedAt);
    return 0;
  }, [order, lane.id, now]);

  const allItemsReady = order.items.every(item => item.status === 'ready');

  const markAllItemsReady = () => {
    order.items.forEach(item => {
      if (item.status !== 'ready') {
        updateItemStatus(order.id, item.id, 'ready');
      }
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card className={cn(
        'p-5 border-l-4 transition-all',
        getPriorityColor(elapsedMinutes)
      )}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">{order.id}</h3>
              <Badge variant={getPriorityBadge(elapsedMinutes).variant}>
                {getPriorityBadge(elapsedMinutes).label}
              </Badge>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Table {order.table} • {formatTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{elapsedMinutes} min</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg transition-colors',
                item.status === 'ready'
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-stone-50 dark:bg-stone-800'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  item.status === 'ready' ? 'bg-green-500' :
                  item.status === 'preparing' ? 'bg-orange-500' : 'bg-stone-300'
                )} />
                <div>
                  <p className="font-semibold text-stone-900 dark:text-white">
                    {item.quantity}x {item.name}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">{item.notes}</p>
                  )}
                </div>
              </div>
              {lane.id === 'preparing' && (
                <Button
                  size="icon"
                  variant={item.status === 'ready' ? 'primary' : 'ghost'}
                  onClick={() => updateItemStatus(
                    order.id,
                    item.id,
                    item.status === 'ready' ? 'preparing' : 'ready'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {lane.id === 'pending' && (
            <Button
              className="w-full"
              onClick={() => acceptOrder(order.id)}
            >
              Accept Order
            </Button>
          )}
          {lane.id === 'preparing' && (
            <div className="flex flex-col gap-2 w-full">
              <Button
                variant="ghost"
                onClick={markAllItemsReady}
                disabled={allItemsReady}
              >
                Mark All Items Ready
              </Button>
              <Button
                className="w-full"
                onClick={() => markOrderServed(order.id)}
              >
                Mark Completed
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 text-stone-400">
        {icon}
      </div>
      <h3 className="font-semibold text-stone-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
    </div>
  );
}

function KanbanView({ ordersByLane }: {
  ordersByLane: Record<Lane['id'], Order[]>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {LANES.map((lane) => {
        const laneOrders = ordersByLane[lane.id] || [];
        return (
          <div key={lane.id} className="flex flex-col">
            <div className="sticky top-0 z-10 bg-stone-50 dark:bg-stone-900 pb-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-stone-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={cn('p-2 rounded-lg', lane.color)}>
                    {lane.icon}
                  </div>
                  <h2 className="font-bold text-stone-900 dark:text-white">{lane.title}</h2>
                </div>
                <Badge>{laneOrders.length}</Badge>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pt-4 min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {laneOrders.length === 0 ? (
                  <EmptyState
                    icon={lane.icon}
                    title={
                      lane.id === 'pending' ? 'No new orders' :
                      lane.id === 'preparing' ? 'No active preparations' :
                      'No completed orders yet'
                    }
                    description="Check back later for updates"
                  />
                ) : (
                  laneOrders.map((order) => (
                    <OrderCard key={order.id} order={order} lane={lane} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabView({ ordersByLane }: {
  ordersByLane: Record<Lane['id'], Order[]>;
}) {
  const [activeTab, setActiveTab] = useState<Lane['id']>('pending');
  const activeLane = LANES.find(l => l.id === activeTab)!;
  const laneOrders = ordersByLane[activeTab] || [];

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 mb-6">
        <div className="flex overflow-x-auto gap-1 p-2">
          {LANES.map((lane) => (
            <button
              key={lane.id}
              onClick={() => setActiveTab(lane.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2',
                activeTab === lane.id
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                  : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
              )}
            >
              {lane.icon}
              {lane.title}
              <Badge variant={activeTab === lane.id ? 'secondary' : 'neutral'}>
                {(ordersByLane[lane.id] || []).length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {laneOrders.length === 0 ? (
            <EmptyState
              icon={activeLane.icon}
              title={
                activeTab === 'pending' ? 'No new orders' :
                activeTab === 'preparing' ? 'No active preparations' :
                'No completed orders yet'
              }
              description="Check back later for updates"
            />
          ) : (
            laneOrders.map((order) => (
              <OrderCard key={order.id} order={order} lane={activeLane} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ChefDashboard() {
  const orders = useOrderStore((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ordersByLane = useMemo(() => {
    const filtered = orders.filter(order =>
      !searchQuery || order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.reduce((acc, order) => {
      let key: Lane['id'] = order.status as Lane['id'];
      if (key === 'accepted') {
        key = 'preparing';
      } else if (key === 'ready') {
        key = 'preparing'; // or 'served' if preferred
      }
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {} as Record<Lane['id'], Order[]>);
  }, [orders, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Kitchen Display</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage orders efficiently</p>
        </div>
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <TabView ordersByLane={ordersByLane} />
        ) : (
          <KanbanView ordersByLane={ordersByLane} />
        )}
      </div>
    </div>
  );
}
