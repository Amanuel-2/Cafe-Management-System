import { BarChart3, Boxes, ChefHat, ClipboardList, LayoutDashboard, Settings, ShoppingBag, Truck, Users } from 'lucide-react';
import { StaffLayout } from './StaffLayout';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Menu', to: '/admin/menu', icon: ShoppingBag },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Employees', to: '/admin/employees', icon: Users },
  { label: 'Recipes', to: '/admin/recipes', icon: ChefHat },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Suppliers', to: '/admin/suppliers', icon: Truck },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  return <StaffLayout workspace="Administration" roleLabel="Admin" navItems={navItems} />;
}

