import { Alert, Box, Button, Card, CardContent, CardHeader, Chip, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { BarChart3, CheckCircle2, CircleDollarSign, Download, ReceiptText, ShoppingCart, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { database } from '../../services/database.js';
import { reportService } from '../../services/reportService.js';
import { formatETB } from '../../utils/currency';

const colors = ['#9a3412', '#2563eb', '#059669', '#7c3aed', '#d97706'];
const dateInput = (value) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const labelMethod = (method) => ({ cash: 'Cash', card: 'Card', mobile: 'Mobile money' }[method] ?? method);
const dateTime = (value) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

function exportTransactions(report) {
  const orders = new Map(report.orders.concat(report.payments.map((payment) => ({ id: payment.orderId }))).map((order) => [order.id, order]));
  const rows = report.payments.map((payment) => {
    const order = orders.get(payment.orderId);
    return [order?.receiptNumber ?? payment.orderId, dateTime(payment.createdAt), labelMethod(payment.method), payment.collectedBy, payment.amount];
  });
  const csv = [['Receipt', 'Date', 'Payment method', 'Collected by', 'Amount'], ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `sales-report-${dateInput(report.range.start)}-${dateInput(report.range.end)}.csv`; link.click(); URL.revokeObjectURL(url);
}

function ChartCard({ title, subtitle, children }) {
  return <Card variant="outlined" sx={{ height: '100%' }}><CardHeader title={title} subheader={subtitle} titleTypographyProps={{ variant: 'h6', fontWeight: 800 }} /><CardContent sx={{ height: 330, pt: 0 }}>{children}</CardContent></Card>;
}

export function ReportsPage() {
  const [period, setPeriod] = useState('week');
  const initial = reportService.getPresetRange('week');
  const [start, setStart] = useState(dateInput(initial.start));
  const [end, setEnd] = useState(dateInput(initial.end));
  const [revision, setRevision] = useState(0);
  useEffect(() => { const refresh = () => setRevision((value) => value + 1); window.addEventListener(database.changeEvent, refresh); return () => window.removeEventListener(database.changeEvent, refresh); }, []);
  const report = useMemo(() => { void revision; return reportService.getReport({ start: `${start}T00:00:00`, end: `${end}T23:59:59` }); }, [start, end, revision]);
  const choosePeriod = (value) => { setPeriod(value); if (value === 'custom') return; const range = reportService.getPresetRange(value); setStart(dateInput(range.start)); setEnd(dateInput(range.end)); };
  const transactionRows = report.payments.map((payment) => { const order = report.orders.find((entry) => entry.id === payment.orderId) ?? database.get('orders', payment.orderId); return { ...payment, receiptNumber: order?.receiptNumber ?? payment.orderId, orderTotal: order?.total ?? payment.amount }; });
  const transactionColumns = [
    { field: 'receiptNumber', header: 'Receipt', minWidth: 170, renderCell: (value) => <Typography fontWeight={800}>{value}</Typography> },
    { field: 'createdAt', header: 'Paid at', minWidth: 190, renderCell: dateTime },
    { field: 'method', header: 'Method', minWidth: 130, renderCell: (value) => <Chip size="small" label={labelMethod(value)} /> },
    { field: 'collectedBy', header: 'Collected by', minWidth: 160 },
    { field: 'amount', header: 'Amount', minWidth: 140, align: 'right', renderCell: formatETB },
  ];
  return <Stack spacing={3}>
    <PageHeader eyebrow="Financial intelligence" title="Reports" description="Reconcile sales, payments, operating expenses, purchasing, and inventory signals for any reporting period." actions={<Button variant="outlined" startIcon={<Download size={18} />} disabled={!report.payments.length} onClick={() => exportTransactions(report)}>Export sales CSV</Button>} />
    <Card variant="outlined"><CardContent><Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}><TextField select size="small" label="Period" value={period} onChange={(event) => choosePeriod(event.target.value)} sx={{ minWidth: 170 }}><MenuItem value="today">Today</MenuItem><MenuItem value="week">Last 7 days</MenuItem><MenuItem value="month">Last 30 days</MenuItem><MenuItem value="custom">Custom range</MenuItem></TextField><TextField size="small" type="date" label="Start date" value={start} onChange={(event) => { setPeriod('custom'); setStart(event.target.value); }} slotProps={{ inputLabel: { shrink: true } }} /><TextField size="small" type="date" label="End date" value={end} onChange={(event) => { setPeriod('custom'); setEnd(event.target.value); }} slotProps={{ inputLabel: { shrink: true } }} /><Box sx={{ flex: 1 }} /><Chip color={report.reconciled ? 'success' : 'error'} icon={report.reconciled ? <CheckCircle2 size={16} /> : undefined} label={report.reconciled ? 'Payments and receipts reconciled' : 'Reconciliation needs review'} /></Stack></CardContent></Card>
    {!report.reconciled ? <Alert severity="error">Payment revenue ({formatETB(report.revenue)}) does not match issued receipts ({formatETB(report.receiptRevenue)}).</Alert> : null}
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Revenue" value={formatETB(report.revenue)} helper={`${report.payments.length} completed payments`} icon={CircleDollarSign} tone="success" /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Orders" value={report.orderCount} helper={`${report.paidOrderCount} paid in period`} icon={ShoppingCart} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Average ticket" value={formatETB(report.averageTicket)} helper="Per completed payment" icon={ReceiptText} tone="neutral" /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Net performance" value={formatETB(report.netPerformance)} helper={`${formatETB(report.expenseTotal)} expenses + ${formatETB(report.purchaseTotal)} purchasing`} icon={TrendingUp} tone={report.netPerformance >= 0 ? 'success' : 'error'} /></Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 8 }}><ChartCard title="Revenue and order trend" subtitle="Daily performance within the selected range"><ResponsiveContainer width="100%" height="100%"><LineChart data={report.trend} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis tickFormatter={(value) => Number(value).toLocaleString()} /><ChartTooltip formatter={(value, name) => name === 'revenue' ? formatETB(Number(value)) : value} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#9a3412" strokeWidth={3} dot={false} /><Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></ChartCard></Grid>
      <Grid size={{ xs: 12, lg: 4 }}><ChartCard title="Payment mix" subtitle="Revenue by completed payment method">{report.paymentMix.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={report.paymentMix} dataKey="amount" nameKey="method" innerRadius={62} outerRadius={98} paddingAngle={3}>{report.paymentMix.map((entry, index) => <Cell key={entry.method} fill={colors[index % colors.length]} />)}</Pie><ChartTooltip formatter={(value) => formatETB(Number(value))} labelFormatter={labelMethod} /><Legend formatter={labelMethod} /></PieChart></ResponsiveContainer> : <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><Typography color="text.secondary">No completed payments in this period.</Typography></Box>}</ChartCard></Grid>
      <Grid size={{ xs: 12, lg: 7 }}><ChartCard title="Top-selling items" subtitle="Quantity sold from reconciled paid orders">{report.topItems.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={report.topItems} layout="vertical" margin={{ left: 24 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={120} /><ChartTooltip /><Bar dataKey="quantity" fill="#d97706" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer> : <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><Typography color="text.secondary">No paid items in this period.</Typography></Box>}</ChartCard></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title="Cost and inventory watch" subheader="Current risks and selected-period outflows" titleTypographyProps={{ variant: 'h6', fontWeight: 800 }} /><CardContent><Stack spacing={2}><MetricCard label="Operating expenses" value={formatETB(report.expenseTotal)} helper={`${report.expenses.length} records`} icon={WalletCards} tone="warning" /><MetricCard label="Received purchases" value={formatETB(report.purchaseTotal)} helper={`${report.purchases.length} received orders`} icon={BarChart3} tone="neutral" /><Box><Typography fontWeight={800} sx={{ mb: 1 }}>Low inventory ({report.lowInventory.length})</Typography>{report.lowInventory.length ? report.lowInventory.slice(0, 4).map((item) => <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}><Typography variant="body2">{item.name}</Typography><Typography variant="body2" color="error.main" fontWeight={800}>{item.stock} {item.unit}</Typography></Stack>) : <Typography variant="body2" color="text.secondary">All stock is above minimum levels.</Typography>}</Box></Stack></CardContent></Card></Grid>
    </Grid>
    <DataTable title="Payment transactions" description={`${transactionRows.length} completed payments · ${formatETB(report.revenue)} reconciled revenue`} rows={transactionRows} columns={transactionColumns} searchPlaceholder="Search receipt, method, or cashier" emptyTitle="No completed payments" emptyDescription="Choose another reporting period or complete a sale." initialSort={{ field: 'createdAt', direction: 'desc' }} initialRowsPerPage={10} />
  </Stack>;
}
