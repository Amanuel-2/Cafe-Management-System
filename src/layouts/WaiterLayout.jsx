import { ClipboardList, Grid3X3, LayoutDashboard, ReceiptText } from 'lucide-react';
import { StaffLayout } from './StaffLayout';
import { PERMISSION } from '../routes/access';

const navItems = [
  { label: 'Floor', to: '/waiter', icon: LayoutDashboard, end: true },
  { label: 'Create order', to: '/waiter/menu', icon: Grid3X3, permission: PERMISSION.CREATE_ORDER },
  { label: 'Active orders', to: '/waiter/orders', icon: ClipboardList, permission: PERMISSION.MANAGE_ORDERS },
  { label: 'Request bill', to: '/waiter/checkout', icon: ReceiptText, permission: PERMISSION.MANAGE_ORDERS },
];

export function WaiterLayout() {
  return <StaffLayout workspace="Waiter Station" roleLabel="Waiter" navItems={navItems} />;
}
