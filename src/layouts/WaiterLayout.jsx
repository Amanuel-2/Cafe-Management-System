import { ClipboardList, Grid3X3, LayoutDashboard, ReceiptText } from 'lucide-react';
import { StaffLayout } from './StaffLayout';

const navItems = [
  { label: 'Floor', to: '/waiter', icon: LayoutDashboard, end: true },
  { label: 'Create order', to: '/waiter/menu', icon: Grid3X3 },
  { label: 'Active orders', to: '/waiter/orders', icon: ClipboardList },
  { label: 'Request bill', to: '/waiter/checkout', icon: ReceiptText },
];

export function WaiterLayout() {
  return <StaffLayout workspace="Waiter Station" roleLabel="Waiter" navItems={navItems} />;
}

