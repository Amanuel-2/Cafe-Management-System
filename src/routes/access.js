export const ROLE = Object.freeze({
  ADMIN: 'admin',
  CASHIER: 'cashier',
  WAITER: 'waiter',
  CHEF: 'chef',
  CONSUMER: 'consumer',
});

export const roleHomePath = Object.freeze({
  [ROLE.ADMIN]: '/admin',
  [ROLE.CASHIER]: '/cashier',
  [ROLE.WAITER]: '/waiter',
  [ROLE.CHEF]: '/chef',
  [ROLE.CONSUMER]: '/menu',
});

export const PERMISSION = Object.freeze({
  MANAGE_EMPLOYEES: 'employees.manage',
  MANAGE_MENU: 'menu.manage',
  MANAGE_INVENTORY: 'inventory.manage',
  MANAGE_SETTINGS: 'settings.manage',
  VIEW_REPORTS: 'reports.view',
  CREATE_ORDER: 'orders.create',
  MANAGE_ORDERS: 'orders.manage',
  PREPARE_ORDERS: 'orders.prepare',
  TAKE_PAYMENT: 'payments.take',
  VIEW_PUBLIC_MENU: 'menu.public.view',
});

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLE.ADMIN]: Object.values(PERMISSION),
  [ROLE.CASHIER]: [PERMISSION.MANAGE_ORDERS, PERMISSION.TAKE_PAYMENT, PERMISSION.VIEW_REPORTS],
  [ROLE.WAITER]: [PERMISSION.CREATE_ORDER, PERMISSION.MANAGE_ORDERS, PERMISSION.VIEW_PUBLIC_MENU],
  [ROLE.CHEF]: [PERMISSION.PREPARE_ORDERS, PERMISSION.VIEW_PUBLIC_MENU],
  [ROLE.CONSUMER]: [PERMISSION.VIEW_PUBLIC_MENU],
});

export const STAFF_ROUTE_ROLES = Object.freeze({
  admin: [ROLE.ADMIN],
  cashier: [ROLE.CASHIER],
  waiter: [ROLE.WAITER],
  chef: [ROLE.CHEF],
});

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

