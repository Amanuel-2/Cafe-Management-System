import { Alert, Button, Chip, Grid, Snackbar, Stack, Typography } from '@mui/material';
import { BellRing, CheckCheck, Clock, ReceiptText, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { formatETB } from '../../utils/currency';

const colors = { pending: 'default', preparing: 'warning', ready: 'success', served: 'info', cancelled: 'error' };

export function WaiterOrdersPage() {
  const { user } = useAuth(); const { orders, markOrderServed, requestBill, refresh } = useOrders(); const [feedback, setFeedback] = useState(null);
  const mine = orders.filter((order) => !user || order.waiterName === user.name).filter((order) => order.paymentStatus !== 'paid' && order.status !== 'cancelled');
  const action = (callback, success) => { try { callback(); setFeedback({ severity: 'success', message: success }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } };
  return <Stack spacing={3}>
    <PageHeader eyebrow="Waiter station" title="Active orders" description="Follow kitchen progress, serve ready orders, and notify the cashier when guests request the bill." actions={<Button variant="outlined" onClick={refresh}>Refresh orders</Button>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Active orders" value={mine.length} helper="Unpaid table orders" icon={ShoppingBag} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Kitchen queue" value={mine.filter((order) => ['pending', 'preparing'].includes(order.status)).length} helper="Pending or cooking" icon={Clock} tone="warning" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Ready to serve" value={mine.filter((order) => order.status === 'ready').length} helper="Kitchen completed" icon={BellRing} tone="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Bills requested" value={mine.filter((order) => order.billRequested).length} helper="Waiting for cashier" icon={ReceiptText} tone="neutral" /></Grid></Grid>
    <Grid container spacing={2}>{mine.map((order) => <Grid key={order.id} size={{ xs: 12, md: 6, xl: 4 }}><Stack spacing={2} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5, bgcolor: 'background.paper', height: '100%' }}><Stack direction="row" justifyContent="space-between"><Stack><Typography variant="h6" fontWeight={850}>{order.table}</Typography><Typography variant="caption" color="text.secondary">{order.receiptNumber} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography></Stack><Chip size="small" color={colors[order.status]} label={order.status} /></Stack><Stack spacing={0.75}>{order.items.map((item) => <Stack key={item.id} direction="row" justifyContent="space-between"><Typography variant="body2">{item.quantity}× {item.name}</Typography><Chip size="small" variant="outlined" label={item.status} /></Stack>)}</Stack><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}><Typography fontWeight={800}>{formatETB(order.total)}</Typography>{order.status === 'ready' ? <Button size="small" variant="contained" startIcon={<CheckCheck size={16} />} onClick={() => action(() => markOrderServed(order.id), `${order.table} marked served.`)}>Mark served</Button> : null}{order.status === 'served' && !order.billRequested ? <Button size="small" variant="contained" startIcon={<ReceiptText size={16} />} onClick={() => action(() => requestBill(order.id), 'Cashier notified of the bill request.')}>Request bill</Button> : null}{order.billRequested ? <Chip size="small" color="info" label="Bill requested" /> : null}</Stack></Stack></Grid>)}</Grid>
    {!mine.length ? <Alert severity="info">No active orders are assigned to you.</Alert> : null}
    <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
