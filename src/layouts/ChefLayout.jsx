import { AlertTriangle, ChefHat, ClipboardList } from 'lucide-react';
import { StaffLayout } from './StaffLayout';

const navItems = [
  { label: 'Kitchen board', to: '/chef', icon: ChefHat, end: true },
  { label: 'Order queue', to: '/chef/queue', icon: ClipboardList },
  { label: 'Inventory alerts', to: '/chef/prep', icon: AlertTriangle },
];

export function ChefLayout() {
  return <StaffLayout workspace="Kitchen Display" roleLabel="Chef" navItems={navItems} />;
}

