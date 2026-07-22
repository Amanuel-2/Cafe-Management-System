import { AlertTriangle, ChefHat, ClipboardList } from 'lucide-react';
import { StaffLayout } from './StaffLayout';
import { PERMISSION } from '../routes/access';

const navItems = [
  { label: 'Kitchen board', to: '/chef', icon: ChefHat, end: true },
  { label: 'Order queue', to: '/chef/queue', icon: ClipboardList, permission: PERMISSION.PREPARE_ORDERS },
  { label: 'Inventory alerts', to: '/chef/prep', icon: AlertTriangle, permission: PERMISSION.VIEW_PUBLIC_MENU },
];

export function ChefLayout() {
  return <StaffLayout workspace="Kitchen Display" roleLabel="Chef" navItems={navItems} />;
}
