const DATABASE_KEY = 'restaurant-management-db';
const DATABASE_VERSION = 1;
const CHANGE_EVENT = 'restaurant:database-change';

const now = () => new Date().toISOString();

const createId = (prefix = 'record') => {
  const value = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
};

const initialDatabase = () => ({
  meta: {
    version: DATABASE_VERSION,
    createdAt: now(),
    updatedAt: now(),
  },
  users: [
    { id: 'user-admin', name: 'Restaurant Admin', email: 'admin@restaurant.com', password: '123456', role: 'admin', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-cashier', name: 'Restaurant Cashier', email: 'cashier@restaurant.com', password: '123456', role: 'cashier', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-chef', name: 'Restaurant Chef', email: 'chef@restaurant.com', password: '123456', role: 'chef', status: 'active', createdAt: now(), updatedAt: now() },
    { id: 'user-waiter', name: 'Restaurant Waiter', email: 'waiter@restaurant.com', password: '123456', role: 'waiter', status: 'active', createdAt: now(), updatedAt: now() },
  ],
  roles: [
    { id: 'role-admin', name: 'Admin', slug: 'admin', system: true },
    { id: 'role-cashier', name: 'Cashier', slug: 'cashier', system: true },
    { id: 'role-waiter', name: 'Waiter', slug: 'waiter', system: true },
    { id: 'role-chef', name: 'Chef', slug: 'chef', system: true },
    { id: 'role-consumer', name: 'Consumer', slug: 'consumer', system: true },
  ],
  employees: [],
  categories: [
    { id: 'category-coffee', name: 'Coffee', type: 'drink', status: 'active', sortOrder: 1, color: 'bg-amber-100 text-amber-900' },
    { id: 'category-breakfast', name: 'Breakfast', type: 'food', status: 'active', sortOrder: 2, color: 'bg-orange-100 text-orange-900' },
    { id: 'category-main', name: 'Main dishes', type: 'food', status: 'active', sortOrder: 3, color: 'bg-emerald-100 text-emerald-900' },
  ],
  menuItems: [
    { id: 'menu-cappuccino', name: 'Cappuccino', categoryId: 'category-coffee', type: 'drink', price: 120, description: 'Espresso with steamed milk and a soft layer of foam.', available: true, prepTimeMinutes: 5, image: '/favicon.svg' },
    { id: 'menu-breakfast', name: 'House Breakfast', categoryId: 'category-breakfast', type: 'food', price: 280, description: 'Eggs, fresh bread, seasonal vegetables, and house sauce.', available: true, prepTimeMinutes: 12, image: '/favicon.svg' },
    { id: 'menu-chicken', name: 'Grilled Chicken Plate', categoryId: 'category-main', type: 'food', price: 480, description: 'Grilled chicken served with vegetables and seasoned rice.', available: true, prepTimeMinutes: 20, image: '/favicon.svg' },
  ],
  recipes: [],
  inventoryItems: [],
  stockMovements: [],
  suppliers: [],
  purchaseOrders: [],
  tables: [],
  orders: [],
  payments: [],
  receipts: [],
  customers: [],
  expenses: [],
  notifications: [],
  auditLogs: [],
  settings: {
    restaurantName: 'Restaurant Manager',
    currency: 'ETB',
    taxRate: 15,
    openingHours: [],
  },
});

const clone = (value) => JSON.parse(JSON.stringify(value));

function readDatabase() {
  const raw = localStorage.getItem(DATABASE_KEY);
  if (!raw) {
    const database = initialDatabase();
    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    return database;
  }

  try {
    const database = JSON.parse(raw);
    if (!database?.meta || !Array.isArray(database.users)) {
      throw new Error('Invalid database structure');
    }
    return database;
  } catch {
    const recoveryKey = `${DATABASE_KEY}:recovery:${Date.now()}`;
    localStorage.setItem(recoveryKey, raw);
    const database = initialDatabase();
    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    return database;
  }
}

function writeDatabase(database, collection) {
  const nextDatabase = {
    ...database,
    meta: { ...database.meta, version: DATABASE_VERSION, updatedAt: now() },
  };
  localStorage.setItem(DATABASE_KEY, JSON.stringify(nextDatabase));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { collection } }));
  return nextDatabase;
}

export const database = {
  key: DATABASE_KEY,
  changeEvent: CHANGE_EVENT,
  initialize() {
    return clone(readDatabase());
  },
  list(collection) {
    const records = readDatabase()[collection];
    return clone(Array.isArray(records) ? records : []);
  },
  get(collection, id) {
    return this.list(collection).find((record) => record.id === id) ?? null;
  },
  find(collection, predicate) {
    return this.list(collection).find(predicate) ?? null;
  },
  create(collection, values, prefix) {
    const current = readDatabase();
    const records = Array.isArray(current[collection]) ? current[collection] : [];
    const timestamp = now();
    const record = { ...values, id: values.id ?? createId(prefix), createdAt: values.createdAt ?? timestamp, updatedAt: timestamp };
    writeDatabase({ ...current, [collection]: [...records, record] }, collection);
    return clone(record);
  },
  update(collection, id, values) {
    const current = readDatabase();
    const records = Array.isArray(current[collection]) ? current[collection] : [];
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return null;
    const updated = { ...records[index], ...values, id, updatedAt: now() };
    const nextRecords = [...records];
    nextRecords[index] = updated;
    writeDatabase({ ...current, [collection]: nextRecords }, collection);
    return clone(updated);
  },
  remove(collection, id) {
    const current = readDatabase();
    const records = Array.isArray(current[collection]) ? current[collection] : [];
    const exists = records.some((record) => record.id === id);
    if (!exists) return false;
    writeDatabase({ ...current, [collection]: records.filter((record) => record.id !== id) }, collection);
    return true;
  },
  getSettings() {
    return clone(readDatabase().settings);
  },
  updateSettings(values) {
    const current = readDatabase();
    const settings = { ...current.settings, ...values, updatedAt: now() };
    writeDatabase({ ...current, settings }, 'settings');
    return clone(settings);
  },
};

database.initialize();
