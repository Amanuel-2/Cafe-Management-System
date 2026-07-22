import { Banknote, ClipboardList, LayoutDashboard, ReceiptText, ShoppingCart } from 'lucide-react';
import { StaffLayout } from './StaffLayout';
import { PERMISSION } from '../routes/access';

const navItems = [
  { label: 'Dashboard', to: '/cashier', icon: LayoutDashboard, end: true },
  { label: 'Point of sale', to: '/cashier/pos', icon: ShoppingCart, permission: PERMISSION.TAKE_PAYMENT },
  { label: 'Orders', to: '/cashier/orders', icon: ClipboardList, permission: PERMISSION.MANAGE_ORDERS },
  { label: 'Payments', to: '/cashier/payments', icon: Banknote, permission: PERMISSION.TAKE_PAYMENT },
  { label: 'Receipts', to: '/cashier/receipts', icon: ReceiptText, permission: PERMISSION.TAKE_PAYMENT },
];

export function CashierLayout() {
  return <StaffLayout workspace="Cashier Station" roleLabel="Cashier" navItems={navItems} />;
}
