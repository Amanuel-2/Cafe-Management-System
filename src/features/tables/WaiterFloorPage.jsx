import { Alert, Button, Chip, Grid, Snackbar, Stack, Typography } from '@mui/material';
import { Armchair, CircleCheck, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { tableService } from '../../services/tableService';
import { useWaiterCartStore } from '../../store/waiterCartStore';

const colors = { available: 'success', occupied: 'error', reserved: 'info', cleaning: 'warning' };

export function WaiterFloorPage() {
  const navigate = useNavigate(); const setTable = useWaiterCartStore((state) => state.setTable); const [tables, setTables] = useState(() => tableService.list()); const [feedback, setFeedback] = useState(null);
  const select = (table) => { if (table.status !== 'available') { setFeedback({ severity: 'warning', message: `${table.name} is currently ${table.status}.` }); return; } setTable(table.id); navigate('/waiter/menu'); };
  return <Stack spacing={3}>
    <PageHeader eyebrow="Waiter station" title="Restaurant floor" description="Select an available table to begin an order or review the current floor state." actions={<Button variant="outlined" onClick={() => setTables(tableService.list())}>Refresh floor</Button>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Tables" value={tables.length} helper="Floor positions" icon={Armchair} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Available" value={tables.filter((table) => table.status === 'available').length} helper="Ready for guests" icon={CircleCheck} tone="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Occupied" value={tables.filter((table) => table.status === 'occupied').length} helper="Orders in service" icon={Users} tone="warning" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Needs attention" value={tables.filter((table) => ['reserved', 'cleaning'].includes(table.status)).length} helper="Reserved or cleaning" icon={Sparkles} tone="neutral" /></Grid></Grid>
    <Grid container spacing={2}>{tables.map((table) => <Grid key={table.id} size={{ xs: 6, sm: 4, md: 3, xl: 2 }}><Button onClick={() => select(table)} disabled={table.status !== 'available'} color={table.status === 'available' ? 'primary' : 'inherit'} sx={{ display: 'block', width: '100%', textAlign: 'left', p: 2, border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', minHeight: 145 }}><Stack spacing={1.25}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" color="text.primary" fontWeight={850}>{table.name}</Typography><Armchair size={20} /></Stack><Typography variant="caption" color="text.secondary">{table.section} · {table.capacity} seats</Typography><Chip size="small" color={colors[table.status]} label={table.status} sx={{ alignSelf: 'flex-start' }} /></Stack></Button></Grid>)}</Grid>
    <Snackbar open={Boolean(feedback)} autoHideDuration={3000} onClose={() => setFeedback(null)}><Alert severity={feedback?.severity ?? 'info'} onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
