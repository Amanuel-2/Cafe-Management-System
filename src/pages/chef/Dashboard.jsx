import { Alert, Button, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { CheckCheck, ChefHat, Clock, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useOrderStore } from '../../store/orderStore';

const lanes = [{ id: 'pending', title: 'New orders', color: 'info' }, { id: 'preparing', title: 'Preparing', color: 'warning' }, { id: 'ready', title: 'Ready', color: 'success' }];

function elapsed(date, currentTime) { return Math.max(0, Math.floor((currentTime - new Date(date).getTime()) / 60000)); }

function KitchenCard({ order, currentTime }) {
  const { acceptOrder, updateItemStatus, markOrderReady } = useOrderStore(); const minutes = elapsed(order.acceptedAt ?? order.createdAt, currentTime); const allReady = order.items.every((item) => item.status === 'ready');
  return <Stack spacing={2} sx={{ border: 1, borderColor: minutes >= 15 ? 'error.main' : 'divider', borderLeftWidth: 4, borderRadius: 2.5, p: 2, bgcolor: 'background.paper' }}>
    <Stack direction="row" justifyContent="space-between"><Stack><Typography fontWeight={850}>{order.table} · {order.receiptNumber}</Typography><Typography variant="caption" color="text.secondary">Waiter: {order.waiterName}</Typography></Stack><Chip size="small" color={minutes >= 15 ? 'error' : minutes >= 10 ? 'warning' : 'default'} icon={<Clock size={14} />} label={`${minutes} min`} /></Stack>
    <Stack spacing={1}>{order.items.map((item) => <Stack key={item.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.25, borderRadius: 2, bgcolor: 'action.hover' }}><Stack><Typography variant="body2" fontWeight={750}>{item.quantity}× {item.name}</Typography>{item.notes ? <Typography variant="caption" color="warning.main">{item.notes}</Typography> : null}</Stack>{order.status === 'preparing' ? <Button size="small" color={item.status === 'ready' ? 'success' : 'inherit'} onClick={() => updateItemStatus(order.id, item.id, item.status === 'ready' ? 'preparing' : 'ready')}>{item.status === 'ready' ? 'Ready' : 'Cooking'}</Button> : <Chip size="small" label={item.status} />}</Stack>)}</Stack>
    {order.status === 'pending' ? <Button variant="contained" startIcon={<ChefHat size={17} />} onClick={() => acceptOrder(order.id)}>Start preparing</Button> : null}
    {order.status === 'preparing' ? <Stack direction="row" spacing={1}><Button fullWidth variant="outlined" disabled={allReady} onClick={() => order.items.filter((item) => item.status !== 'ready').forEach((item) => updateItemStatus(order.id, item.id, 'ready'))}>Mark all ready</Button><Button fullWidth variant="contained" disabled={!allReady} startIcon={<CheckCheck size={17} />} onClick={() => markOrderReady(order.id)}>Ready for service</Button></Stack> : null}
  </Stack>;
}

export function ChefDashboard() {
  const orders = useOrderStore((state) => state.orders); const refresh = useOrderStore((state) => state.refresh); const [query, setQuery] = useState(''); const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setCurrentTime(Date.now()), 30000); return () => window.clearInterval(timer); }, []);
  const active = useMemo(() => orders.filter((order) => ['pending', 'preparing', 'ready'].includes(order.status) && (!query || `${order.receiptNumber} ${order.table} ${order.items.map((item) => item.name).join(' ')}`.toLowerCase().includes(query.toLowerCase()))), [orders, query]);
  return <Stack spacing={3}>
    <PageHeader eyebrow="Kitchen display" title="Order queue" description="Progress tickets through new, preparing, and ready states with live wait timers." actions={<Stack direction="row" spacing={1}><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" slotProps={{ input: { startAdornment: <Search size={17} style={{ marginRight: 8 }} /> } }} /><Button variant="outlined" onClick={refresh}>Refresh</Button></Stack>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, md: 3 }}><MetricCard label="Active tickets" value={active.length} helper="Kitchen workload" icon={ShoppingBag} /></Grid>{lanes.map((lane) => <Grid key={lane.id} size={{ xs: 12, md: 3 }}><MetricCard label={lane.title} value={active.filter((order) => order.status === lane.id).length} helper="Current queue" icon={lane.id === 'preparing' ? ChefHat : lane.id === 'ready' ? CheckCheck : Clock} tone={lane.id === 'preparing' ? 'warning' : lane.id === 'ready' ? 'success' : 'neutral'} /></Grid>)}</Grid>
    <Grid container spacing={2}>{lanes.map((lane) => { const laneOrders = active.filter((order) => order.status === lane.id); return <Grid key={lane.id} size={{ xs: 12, lg: 4 }}><Stack spacing={1.5}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={850}>{lane.title}</Typography><Chip size="small" color={lane.color} label={laneOrders.length} /></Stack>{laneOrders.map((order) => <KitchenCard key={order.id} order={order} currentTime={currentTime} />)}{!laneOrders.length ? <Alert severity="info">No {lane.title.toLowerCase()}.</Alert> : null}</Stack></Grid>; })}</Grid>
  </Stack>;
}
