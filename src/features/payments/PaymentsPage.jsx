import { Chip, Grid, Stack, Typography } from '@mui/material';
import { Banknote, CreditCard, Smartphone, WalletCards } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatETB } from '../../utils/currency';

export function PaymentsPage() {
  const payments = paymentService.list(); const orders = orderService.list(); const orderMap = new Map(orders.map((order) => [order.id, order])); const today = paymentService.todaySummary();
  const columns = [{ field: 'id', header: 'Payment', minWidth: 170, renderCell: (value) => <Typography variant="body2" fontWeight={800}>{value.slice(-12)}</Typography> }, { field: 'orderId', header: 'Receipt', minWidth: 170, getValue: (row) => orderMap.get(row.orderId)?.receiptNumber ?? row.orderId }, { field: 'method', header: 'Method', minWidth: 110, renderCell: (value) => <Chip size="small" label={value} /> }, { field: 'amount', header: 'Amount', minWidth: 130, renderCell: (value) => formatETB(value) }, { field: 'change', header: 'Change', minWidth: 110, renderCell: (value) => formatETB(value ?? 0) }, { field: 'collectedBy', header: 'Cashier', minWidth: 170 }, { field: 'createdAt', header: 'Completed', minWidth: 180, renderCell: (value) => new Date(value).toLocaleString() }];
  return <Stack spacing={3}><PageHeader eyebrow="Cashier station" title="Payments" description="Review completed payment transactions and collection methods." /><Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Today's sales" value={formatETB(today.sales)} helper="Completed payments" icon={WalletCards} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Transactions" value={today.payments.length} helper="Completed today" icon={CreditCard} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Cash" value={formatETB(today.cash)} helper="Cash collected today" icon={Banknote} tone="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Digital" value={formatETB(today.sales - today.cash)} helper="Card and mobile" icon={Smartphone} tone="neutral" /></Grid></Grid><DataTable title="Payment history" description={`${payments.length} immutable completed transactions`} rows={payments} columns={columns} searchPlaceholder="Search payments" emptyTitle="No payments found" initialSort={{ field: 'createdAt', direction: 'desc' }} initialRowsPerPage={10} /></Stack>;
}
