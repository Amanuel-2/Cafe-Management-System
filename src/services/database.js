const DATABASE_KEY = 'restaurant-management-db';
const DATABASE_VERSION = 6;
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
  employees: [
    { id: 'employee-admin', userId: 'user-admin', name: 'Restaurant Admin', role: 'Admin', email: 'admin@restaurant.com', phone: '+251 911 000 101', status: 'active' },
    { id: 'employee-cashier', userId: 'user-cashier', name: 'Restaurant Cashier', role: 'Cashier', email: 'cashier@restaurant.com', phone: '+251 911 000 102', status: 'active' },
    { id: 'employee-chef', userId: 'user-chef', name: 'Restaurant Chef', role: 'Chef', email: 'chef@restaurant.com', phone: '+251 911 000 103', status: 'active' },
    { id: 'employee-waiter', userId: 'user-waiter', name: 'Restaurant Waiter', role: 'Waiter', email: 'waiter@restaurant.com', phone: '+251 911 000 104', status: 'active' },
  ],
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
  recipes: [
    { id: 'recipe-cappuccino', name: 'House Cappuccino', menuItemId: 'menu-cappuccino', ingredients: [{ inventoryItemId: 'inventory-coffee', quantity: 0.018 }, { inventoryItemId: 'inventory-milk', quantity: 0.2 }] },
    { id: 'recipe-breakfast', name: 'House Breakfast', menuItemId: 'menu-breakfast', ingredients: [{ inventoryItemId: 'inventory-eggs', quantity: 0.1 }, { inventoryItemId: 'inventory-bread', quantity: 0.25 }, { inventoryItemId: 'inventory-vegetables', quantity: 0.2 }] },
  ],
  inventoryItems: [
    { id: 'inventory-coffee', name: 'Espresso beans', category: 'Coffee', unit: 'kg', stock: 18, parLevel: 12, minimumStock: 12, supplierId: 'supplier-roast', expirationDate: '2026-10-30' },
    { id: 'inventory-bread', name: 'Fresh bread', category: 'Bakery', unit: 'loaves', stock: 8, parLevel: 10, minimumStock: 10, supplierId: 'supplier-fresh', expirationDate: '2026-07-25' },
    { id: 'inventory-eggs', name: 'Eggs', category: 'Dairy', unit: 'trays', stock: 14, parLevel: 8, minimumStock: 8, supplierId: 'supplier-fresh', expirationDate: '2026-08-05' },
    { id: 'inventory-milk', name: 'Whole milk', category: 'Dairy', unit: 'litres', stock: 24, parLevel: 10, minimumStock: 10, supplierId: 'supplier-fresh', expirationDate: '2026-07-28' },
    { id: 'inventory-vegetables', name: 'Vegetables', category: 'Produce', unit: 'kg', stock: 16, parLevel: 8, minimumStock: 8, supplierId: 'supplier-fresh', expirationDate: '2026-07-27' },
  ],
  stockMovements: [
    { id: 'movement-opening-coffee', inventoryItemId: 'inventory-coffee', type: 'opening_balance', quantity: 18, reason: 'Initial stock balance', createdAt: now() },
    { id: 'movement-opening-bread', inventoryItemId: 'inventory-bread', type: 'opening_balance', quantity: 8, reason: 'Initial stock balance', createdAt: now() },
    { id: 'movement-opening-eggs', inventoryItemId: 'inventory-eggs', type: 'opening_balance', quantity: 14, reason: 'Initial stock balance', createdAt: now() },
    { id: 'movement-opening-milk', inventoryItemId: 'inventory-milk', type: 'opening_balance', quantity: 24, reason: 'Initial stock balance', createdAt: now() },
    { id: 'movement-opening-vegetables', inventoryItemId: 'inventory-vegetables', type: 'opening_balance', quantity: 16, reason: 'Initial stock balance', createdAt: now() },
  ],
  suppliers: [
    { id: 'supplier-fresh', name: 'Fresh Fields Supply', contact: 'Nora Bekele', phone: '+251 911 200 100', email: 'orders@freshfields.example', status: 'active' },
    { id: 'supplier-roast', name: 'Addis Roast Works', contact: 'Omar Ali', phone: '+251 911 200 200', email: 'sales@addisroast.example', status: 'active' },
  ],
  purchaseOrders: [],
  tables: Array.from({ length: 12 }, (_, index) => ({
    id: `table-${String(index + 1).padStart(2, '0')}`,
    name: `T-${String(index + 1).padStart(2, '0')}`,
    capacity: index < 4 ? 2 : index < 9 ? 4 : 6,
    section: index < 6 ? 'Main dining' : 'Patio',
    status: 'available',
  })),
  orders: [],
  payments: [],
  receipts: [],
  customers: [],
  expenses: [],
  notifications: [
    { id: 'notification-low-bread', title: 'Low stock', description: 'Fresh bread is below its minimum stock level.', read: false, type: 'inventory', createdAt: now() },
  ],
  auditLogs: [],
  settings: {
    restaurantName: 'Restaurant Manager',
    currency: 'ETB',
    taxRate: 15,
    openingHours: [],
  },
});

const clone = (value) => JSON.parse(JSON.stringify(value));

function mergeSeedRecords(records, seedRecords, uniqueField = 'id') {
  const current = Array.isArray(records) ? records : [];
  const existingValues = new Set(current.map((record) => record[uniqueField]));
  return [...current, ...seedRecords.filter((record) => !existingValues.has(record[uniqueField]))];
}

function migrateDatabase(database) {
  const seed = initialDatabase();
  if ((database.meta?.version ?? 0) >= DATABASE_VERSION) return database;

  const inventoryItems = mergeSeedRecords(database.inventoryItems, seed.inventoryItems).map((item) => ({ ...item, cost: item.cost ?? 0, minimumStock: item.minimumStock ?? item.parLevel ?? 0 }));
  const recipes = mergeSeedRecords(database.recipes, seed.recipes).map((recipe) => ({
    ...recipe,
    ingredients: (recipe.ingredients ?? []).map((ingredient) => {
      if (typeof ingredient !== 'string') return ingredient;
      const inventoryItem = inventoryItems.find((item) => item.name.toLowerCase() === ingredient.toLowerCase());
      return { inventoryItemId: inventoryItem?.id ?? '', quantity: 1 };
    }).filter((ingredient) => ingredient.inventoryItemId),
  }));
  const stockMovements = Array.isArray(database.stockMovements) ? [...database.stockMovements] : [];
  inventoryItems.forEach((item) => {
    if (stockMovements.some((movement) => movement.inventoryItemId === item.id && movement.type === 'opening_balance')) return;
    const recordedChange = stockMovements.filter((movement) => movement.inventoryItemId === item.id).reduce((sum, movement) => sum + movement.quantity, 0);
    stockMovements.push({ id: createId('movement'), inventoryItemId: item.id, type: 'opening_balance', quantity: item.stock - recordedChange, reason: 'Migrated opening stock balance', createdAt: database.meta?.createdAt ?? now() });
  });

  const migrated = {
    ...seed,
    ...database,
    meta: { ...seed.meta, ...database.meta, version: DATABASE_VERSION, updatedAt: now() },
    users: mergeSeedRecords(database.users, seed.users, 'email'),
    roles: mergeSeedRecords(database.roles, seed.roles, 'slug'),
    employees: mergeSeedRecords(database.employees, seed.employees, 'email'),
    categories: mergeSeedRecords(database.categories, seed.categories),
    menuItems: mergeSeedRecords(database.menuItems, seed.menuItems),
    recipes,
    inventoryItems,
    stockMovements,
    suppliers: mergeSeedRecords(database.suppliers, seed.suppliers),
    tables: mergeSeedRecords(database.tables, seed.tables),
    notifications: mergeSeedRecords(database.notifications, seed.notifications),
    settings: { ...seed.settings, ...database.settings },
  };
  localStorage.setItem(DATABASE_KEY, JSON.stringify(migrated));
  return migrated;
}

function readDatabase() {
  const raw = localStorage.getItem(DATABASE_KEY);
  if (!raw) {
    const database = initialDatabase();
    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
    return migrateDatabase(database);
  }

  try {
    const database = JSON.parse(raw);
    if (!database?.meta || !Array.isArray(database.users)) {
      throw new Error('Invalid database structure');
    }
    return migrateDatabase(database);
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
  createId,
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
  transaction(mutator, collection = 'database') {
    const current = clone(readDatabase());
    const result = mutator(current);
    writeDatabase(current, collection);
    return clone(result);
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
