import { Banknote, ClipboardList, LayoutDashboard, ReceiptText, ShoppingCart } from 'lucide-react';
import { StaffLayout } from './StaffLayout';

const navItems = [
  { label: 'Dashboard', to: '/cashier', icon: LayoutDashboard, end: true },
  { label: 'Point of sale', to: '/cashier/pos', icon: ShoppingCart },
  { label: 'Orders', to: '/cashier/orders', icon: ClipboardList },
  { label: 'Payments', to: '/cashier/payments', icon: Banknote },
  { label: 'Receipts', to: '/cashier/receipts', icon: ReceiptText },
];

export function CashierLayout() {
  return <StaffLayout workspace="Cashier Station" roleLabel="Cashier" navItems={navItems} />;
}

