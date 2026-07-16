import type {
  Employee,
  InventoryItem,
  MenuCategory,
  MenuItem,
  Notification,
  Order,
  ReportMetric,
  Supplier,
  TimelineEvent,
} from '../types/domain';

export const categories: MenuCategory[] = [
  { id: 'coffee', name: 'Coffee', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' },
  { id: 'breakfast', name: 'Breakfast', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200' },
  { id: 'lunch', name: 'Lunch', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' },
  { id: 'dessert', name: 'Dessert', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200' },
];

export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Cappuccino', categoryId: 'coffee', price: 4.5, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm2', name: 'Avocado Toast', categoryId: 'breakfast', price: 9.75, image: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec5?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm3', name: 'Chicken Panini', categoryId: 'lunch', price: 12.5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm4', name: 'Berry Tart', categoryId: 'dessert', price: 6.25, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
];

const generateTimeline = (order: Partial<Order>): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    { id: 't1', title: 'Order Created', timestamp: order.createdAt as string, completed: true },
  ];
  if (order.acceptedAt) {
    events.push({ id: 't2', title: 'Chef Accepted', timestamp: order.acceptedAt, completed: true });
  }
  if (order.readyAt) {
    events.push({ id: 't3', title: 'Preparing', timestamp: order.readyAt, completed: true });
  }
  if (order.servedAt) {
    events.push({ id: 't4', title: 'Served', timestamp: order.servedAt, completed: true });
  }
  if (order.paidAt) {
    events.push({ id: 't5', title: 'Paid', timestamp: order.paidAt, completed: true });
  }
  return events;
};

export const orders: Order[] = [
  {
    id: 'ORD-1042',
    receiptNumber: 'RCP-2026-1042',
    table: 'T-07',
    waiterName: 'Maya',
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    subtotal: 27,
    tax: 2.16,
    discount: 0,
    total: 29.16,
    items: [
      { id: 'oi1', menuItemId: 'm1', name: 'Cappuccino', image: menuItems[0].image, price: 4.5, quantity: 2, status: 'pending' },
      { id: 'oi2', menuItemId: 'm2', name: 'Avocado Toast', image: menuItems[1].image, price: 9.75, quantity: 2, notes: 'No chili flakes', status: 'pending' },
    ],
    timeline: [],
  },
  {
    id: 'ORD-1043',
    receiptNumber: 'RCP-2026-1043',
    table: 'T-03',
    waiterName: 'Noah',
    status: 'preparing',
    paymentStatus: 'unpaid',
    paymentMethod: 'telebirr',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    subtotal: 18.75,
    tax: 1.5,
    discount: 0,
    total: 20.25,
    items: [
      { id: 'oi3', menuItemId: 'm3', name: 'Chicken Panini', image: menuItems[2].image, price: 12.5, quantity: 1, status: 'preparing' },
      { id: 'oi4', menuItemId: 'm4', name: 'Berry Tart', image: menuItems[3].image, price: 6.25, quantity: 1, status: 'ready' },
    ],
    timeline: [],
  },
  {
    id: 'ORD-1044',
    receiptNumber: 'RCP-2026-1044',
    table: 'T-05',
    waiterName: 'Lily',
    status: 'ready',
    paymentStatus: 'unpaid',
    paymentMethod: 'cbe_birr',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    readyAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    subtotal: 23,
    tax: 1.84,
    discount: 0,
    total: 24.84,
    items: [
      { id: 'oi5', menuItemId: 'm1', name: 'Cappuccino', image: menuItems[0].image, price: 4.5, quantity: 2, status: 'ready' },
      { id: 'oi6', menuItemId: 'm4', name: 'Berry Tart', image: menuItems[3].image, price: 6.25, quantity: 2, status: 'ready' },
    ],
    timeline: [],
  },
  {
    id: 'ORD-1045',
    receiptNumber: 'RCP-2026-1045',
    table: 'T-02',
    waiterName: 'Maya',
    status: 'served',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
    readyAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    servedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 1.2).toISOString(),
    collectedBy: 'John',
    subtotal: 34.75,
    tax: 2.78,
    discount: 2,
    total: 35.53,
    items: [
      { id: 'oi7', menuItemId: 'm1', name: 'Cappuccino', image: menuItems[0].image, price: 4.5, quantity: 1, status: 'ready' },
      { id: 'oi8', menuItemId: 'm2', name: 'Avocado Toast', image: menuItems[1].image, price: 9.75, quantity: 2, status: 'ready' },
      { id: 'oi9', menuItemId: 'm3', name: 'Chicken Panini', image: menuItems[2].image, price: 12.5, quantity: 1, status: 'ready' },
    ],
    timeline: [],
  },
  {
    id: 'ORD-1046',
    receiptNumber: 'RCP-2026-1046',
    table: 'T-10',
    waiterName: 'Noah',
    status: 'cancelled',
    paymentStatus: 'unpaid',
    paymentMethod: 'other',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    subtotal: 9.75,
    tax: 0.78,
    discount: 0,
    total: 10.53,
    items: [
      { id: 'oi10', menuItemId: 'm2', name: 'Avocado Toast', image: menuItems[1].image, price: 9.75, quantity: 1, status: 'pending' },
    ],
    timeline: [],
  },
].map(order => ({
  ...order,
  timeline: generateTimeline(order),
}));

export const employees: Employee[] = [
  { id: 'e1', name: 'Ava Thompson', role: 'Manager', email: 'ava@cafe.test', status: 'active' },
  { id: 'e2', name: 'Maya Chen', role: 'Waiter', email: 'maya@cafe.test', status: 'active' },
  { id: 'e3', name: 'Leo Martin', role: 'Chef', email: 'leo@cafe.test', status: 'active' },
];

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Fresh Fields', contact: 'Nora Lee', phone: '+1 555 0142' },
  { id: 's2', name: 'Roast Works', contact: 'Omar Wells', phone: '+1 555 0188' },
];

export const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Espresso Beans', category: 'Coffee', unit: 'kg', stock: 18, parLevel: 12, supplierId: 's2' },
  { id: 'i2', name: 'Sourdough', category: 'Bakery', unit: 'loaves', stock: 8, parLevel: 10, supplierId: 's1' },
  { id: 'i3', name: 'Avocados', category: 'Produce', unit: 'pcs', stock: 22, parLevel: 18, supplierId: 's1' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Order ready', description: 'ORD-1043 has one item ready for pickup.', read: false, createdAt: '2026-07-15T09:22:00Z', type: 'order' },
  { id: 'n2', title: 'Low stock', description: 'Sourdough is below par level.', read: false, createdAt: '2026-07-15T08:50:00Z', type: 'inventory' },
];

export const reports: ReportMetric[] = [
  { id: 'r1', label: 'Today sales', value: '$2,840', change: '+12%', trend: 'up' },
  { id: 'r2', label: 'Open orders', value: '18', change: '+4', trend: 'up' },
  { id: 'r3', label: 'Avg ticket', value: '$18.70', change: '-3%', trend: 'down' },
];

export const recipes = [
  { id: 'rec1', name: 'House Cappuccino', ingredients: ['Espresso', 'Steamed milk', 'Foam'], menuItemId: 'm1' },
  { id: 'rec2', name: 'Avocado Toast', ingredients: ['Sourdough', 'Avocado', 'Lemon', 'Herbs'], menuItemId: 'm2' },
];
