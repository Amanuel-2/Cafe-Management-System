import { Box, Card, CardContent, CardHeader, Chip, Grid, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { Boxes, ClipboardList, CircleDollarSign, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { database } from '../../services/database.js';
import { employeeService } from '../../services/employeeService';
import { reportService } from '../../services/reportService.js';
import { formatETB } from '../../utils/currency';

const inputDate = (value) => { const date = new Date(value); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
const dateTime = (value) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(inputDate(new Date()));
  const [revision, setRevision] = useState(0);
  useEffect(() => { const refresh = () => setRevision((value) => value + 1); window.addEventListener(database.changeEvent, refresh); return () => window.removeEventListener(database.changeEvent, refresh); }, []);
  const report = useMemo(() => { void revision; return reportService.getReport({ start: `${selectedDate}T00:00:00`, end: `${selectedDate}T23:59:59` }); }, [selectedDate, revision]);
  const employees = useMemo(() => { void revision; return employeeService.list(); }, [revision]);
  const orderColumns = [
    { field: 'receiptNumber', header: 'Order', minWidth: 170, renderCell: (value) => <Typography fontWeight={800}>{value}</Typography> },
    { field: 'table', header: 'Service point', minWidth: 130 },
    { field: 'createdAt', header: 'Created', minWidth: 190, renderCell: dateTime },
    { field: 'status', header: 'Status', minWidth: 120, renderCell: (value) => <Chip size="small" label={value} color={value === 'cancelled' ? 'error' : value === 'served' ? 'success' : 'warning'} /> },
    { field: 'total', header: 'Total', minWidth: 130, align: 'right', renderCell: formatETB },
  ];
  return <Stack spacing={3}>
    <PageHeader eyebrow="Operations overview" title="Admin dashboard" description="A live view of sales, service activity, staffing, and inventory risk from persisted operational records." actions={<TextField size="small" type="date" label="Reporting date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />} />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Sales" value={formatETB(report.revenue)} helper={`${report.paidOrderCount} paid orders`} icon={CircleDollarSign} tone="success" /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Open orders" value={report.openOrders} helper={`${report.orderCount} orders on selected date`} icon={ClipboardList} tone="warning" /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Active staff" value={employees.filter((employee) => employee.status === 'active').length} helper={`${employees.length} team members`} icon={Users} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Low stock" value={report.lowInventory.length} helper="At or below minimum level" icon={Boxes} tone={report.lowInventory.length ? 'error' : 'success'} /></Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 8 }}><DataTable title="Recent orders" description={`Orders created on ${new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(`${selectedDate}T12:00:00`))}`} rows={report.recentOrders} columns={orderColumns} searchPlaceholder="Search order or service point" emptyTitle="No orders on this date" initialSort={{ field: 'createdAt', direction: 'desc' }} /></Grid>
      <Grid size={{ xs: 12, lg: 4 }}><Card variant="outlined" sx={{ height: '100%' }}><CardHeader title="Inventory watch" subheader={`${report.lowInventory.length} items need attention`} titleTypographyProps={{ variant: 'h6', fontWeight: 800 }} /><CardContent><Stack spacing={2.5}>{report.lowInventory.length ? report.lowInventory.slice(0, 8).map((item) => { const minimum = Number(item.minimumStock ?? item.parLevel ?? 0); const level = minimum ? Math.min(100, (Number(item.stock) / minimum) * 100) : 100; return <Box key={item.id}><Stack direction="row" justifyContent="space-between" spacing={2}><Typography variant="body2" fontWeight={800}>{item.name}</Typography><Typography variant="body2" color="error.main">{item.stock} {item.unit}</Typography></Stack><LinearProgress color="error" variant="determinate" value={level} sx={{ mt: 1, height: 7, borderRadius: 4 }} /><Typography variant="caption" color="text.secondary">Minimum: {minimum} {item.unit}</Typography></Box>; }) : <Box sx={{ py: 7, textAlign: 'center' }}><Boxes size={34} /><Typography fontWeight={800} sx={{ mt: 1 }}>Stock levels look healthy</Typography><Typography variant="body2" color="text.secondary">No item is at or below its minimum.</Typography></Box>}</Stack></CardContent></Card></Grid>
    </Grid>
  </Stack>;
}
