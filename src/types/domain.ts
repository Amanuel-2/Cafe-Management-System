export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid';

export type PaymentMethod = 'cash' | 'telebirr' | 'cbe_birr' | 'dashen' | 'bank_transfer' | 'other';

export type ItemStatus = 'pending' | 'preparing' | 'ready';

export type MenuCategory = {
  id: string;
  name: string;
  color: string;
};

export type MenuItem = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  available: boolean;
  prepTimeMinutes: number;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  notes?: string;
  status: ItemStatus;
};

export type TimelineEvent = {
  id: string;
  title: string;
  timestamp: string;
  completed: boolean;
};

export type Order = {
  id: string;
  receiptNumber: string;
  table: string;
  waiterName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  acceptedAt?: string;
  readyAt?: string;
  servedAt?: string;
  paidAt?: string;
  collectedBy?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  timeline: TimelineEvent[];
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  parLevel: number;
  supplierId: string;
};

export type Employee = {
  id: string;
  name: string;
  role: 'Manager' | 'Waiter' | 'Chef' | 'Cashier';
  email: string;
  status: 'active' | 'off-duty';
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: 'order' | 'inventory' | 'system';
};

export type ReportMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
};
