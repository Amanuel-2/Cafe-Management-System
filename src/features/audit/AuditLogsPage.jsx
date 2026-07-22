import { Chip, Grid, Stack, Typography } from '@mui/material';
import { Activity, LogIn, ShieldCheck } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { auditService } from '../../services/auditService';

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

const columns = [
  { field: 'createdAt', header: 'Time', minWidth: 180, renderCell: (value) => formatDateTime(value) },
  { field: 'actorName', header: 'Actor', minWidth: 170, renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 750 }}>{value}</Typography> },
  { field: 'action', header: 'Action', minWidth: 150, renderCell: (value) => <Chip size="small" variant="outlined" label={value} /> },
  { field: 'entityType', header: 'Entity', minWidth: 110 },
  { field: 'message', header: 'Details', minWidth: 300 },
];

export function AuditLogsPage() {
  const logs = auditService.list();
  const today = new Date().toDateString();
  const todayCount = logs.filter((log) => new Date(log.createdAt).toDateString() === today).length;
  const authEvents = logs.filter((log) => log.action.startsWith('auth.')).length;
  const accessChanges = logs.filter((log) => log.entityType === 'employee' || log.entityType === 'role').length;

  return (
    <Stack spacing={3}>
      <PageHeader eyebrow="Security and compliance" title="Audit logs" description="Review authentication, employee, and access-control changes recorded by the local application database." />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Total events" value={logs.length} helper="Recorded activity" icon={Activity} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Today" value={todayCount} helper="Events since midnight" icon={ShieldCheck} tone="success" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Auth events" value={authEvents} helper={`${accessChanges} access changes`} icon={LogIn} tone="neutral" /></Grid>
      </Grid>
      <DataTable title="Activity history" description={`${logs.length} immutable audit records`} rows={logs} columns={columns} searchPlaceholder="Search audit logs" emptyTitle="No audit events yet" emptyDescription="Sign-ins and administrative changes will appear here." initialSort={{ field: 'createdAt', direction: 'desc' }} initialRowsPerPage={10} />
    </Stack>
  );
}

