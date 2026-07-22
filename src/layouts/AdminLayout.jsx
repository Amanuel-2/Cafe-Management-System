import { Armchair, BarChart3, Boxes, ChefHat, CircleDollarSign, ClipboardList, LayoutDashboard, ScrollText, Settings, ShieldCheck, ShoppingBag, ShoppingCart, Tags, Truck, UserRound, Users } from 'lucide-react';
import { StaffLayout } from './StaffLayout';
import { PERMISSION } from '../routes/access';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList, permission: PERMISSION.MANAGE_ORDERS },
  { label: 'Tables', to: '/admin/tables', icon: Armchair, permission: PERMISSION.MANAGE_ORDERS },
  { label: 'Customers', to: '/admin/customers', icon: UserRound, permission: PERMISSION.MANAGE_ORDERS },
  { label: 'Expenses', to: '/admin/expenses', icon: CircleDollarSign, permission: PERMISSION.VIEW_REPORTS },
  { label: 'Menu', to: '/admin/menu', icon: ShoppingBag, permission: PERMISSION.MANAGE_MENU },
  { label: 'Categories', to: '/admin/categories', icon: Tags, permission: PERMISSION.MANAGE_MENU },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes, permission: PERMISSION.MANAGE_INVENTORY },
  { label: 'Purchasing', to: '/admin/purchasing', icon: ShoppingCart, permission: PERMISSION.MANAGE_INVENTORY },
  { label: 'Employees', to: '/admin/employees', icon: Users, permission: PERMISSION.MANAGE_EMPLOYEES },
  { label: 'Roles', to: '/admin/roles', icon: ShieldCheck, permission: PERMISSION.MANAGE_EMPLOYEES },
  { label: 'Recipes', to: '/admin/recipes', icon: ChefHat, permission: PERMISSION.MANAGE_MENU },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3, permission: PERMISSION.VIEW_REPORTS },
  { label: 'Suppliers', to: '/admin/suppliers', icon: Truck, permission: PERMISSION.MANAGE_INVENTORY },
  { label: 'Audit logs', to: '/admin/audit-logs', icon: ScrollText, permission: PERMISSION.MANAGE_EMPLOYEES },
  { label: 'Settings', to: '/admin/settings', icon: Settings, permission: PERMISSION.MANAGE_SETTINGS },
];

export function AdminLayout() {
  return <StaffLayout workspace="Administration" roleLabel="Admin" navItems={navItems} />;
}
