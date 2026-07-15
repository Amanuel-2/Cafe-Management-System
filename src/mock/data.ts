import type {
  Employee,
  InventoryItem,
  MenuCategory,
  MenuItem,
  Notification,
  Order,
  ReportMetric,
  Supplier,
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

export const orders: Order[] = [
  {
    id: 'ORD-1042',
    table: 'T-07',
    waiterName: 'Maya',
    status: 'pending',
    createdAt: '2026-07-15T09:12:00Z',
    total: 27,
    items: [
      { id: 'oi1', menuItemId: 'm1', name: 'Cappuccino', quantity: 2, status: 'pending' },
      { id: 'oi2', menuItemId: 'm2', name: 'Avocado Toast', quantity: 2, notes: 'No chili flakes', status: 'pending' },
    ],
  },
  {
    id: 'ORD-1043',
    table: 'T-03',
    waiterName: 'Noah',
    status: 'preparing',
    createdAt: '2026-07-15T09:18:00Z',
    total: 18.75,
    items: [
      { id: 'oi3', menuItemId: 'm3', name: 'Chicken Panini', quantity: 1, status: 'preparing' },
      { id: 'oi4', menuItemId: 'm4', name: 'Berry Tart', quantity: 1, status: 'ready' },
    ],
  },
];

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
