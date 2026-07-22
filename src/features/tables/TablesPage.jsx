import { Alert, Button, Chip, Grid, IconButton, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Armchair, CircleCheck, Pencil, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { tableService } from '../../services/tableService';

const schema = z.object({ name: z.string().trim().min(2, 'Table name is required.'), capacity: z.number().int().positive('Capacity must be at least one.'), section: z.string().trim().min(2, 'Section is required.'), status: z.enum(['available', 'occupied', 'reserved', 'cleaning']) });
const defaults = { name: '', capacity: 4, section: 'Main dining', status: 'available' };
const colors = { available: 'success', occupied: 'error', reserved: 'info', cleaning: 'warning' };

function TableForm({ table, actor, open, onClose, onSaved }) {
  const { control, handleSubmit, setError } = useForm({ values: table ? { ...defaults, ...table } : defaults });
  const submit = (values) => { const parsed = schema.safeParse(values); if (!parsed.success) { parsed.error.issues.forEach((issue) => setError(issue.path[0], { message: issue.message })); return; } try { const saved = table ? tableService.update(table.id, parsed.data, actor) : tableService.create(parsed.data, actor); onSaved(saved, table ? 'Table updated.' : 'Table created.'); } catch (error) { setError('name', { message: error.message }); } };
  return <FormDialog open={open} title={table ? 'Edit table' : 'Add table'} description="Configure floor identity, seating capacity, section, and operational state." submitLabel={table ? 'Save changes' : 'Create table'} onClose={onClose} onSubmit={handleSubmit(submit)}>
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 7 }}><Controller name="name" control={control} render={({ field, fieldState }) => <TextField {...field} label="Table name" required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} /></Grid><Grid size={{ xs: 12, sm: 5 }}><Controller name="capacity" control={control} render={({ field, fieldState }) => <TextField {...field} type="number" label="Capacity" required fullWidth onChange={(event) => field.onChange(Number(event.target.value))} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} /></Grid></Grid>
    <Controller name="section" control={control} render={({ field, fieldState }) => <TextField {...field} label="Section" required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} />
    <Controller name="status" control={control} render={({ field }) => <TextField {...field} select label="Status" fullWidth>{['available', 'occupied', 'reserved', 'cleaning'].map((status) => <MenuItem key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</MenuItem>)}</TextField>} />
  </FormDialog>;
}

export function TablesPage() {
  const { user } = useAuth(); const [tables, setTables] = useState(() => tableService.list()); const [editing, setEditing] = useState(null); const [deleting, setDeleting] = useState(null); const [formOpen, setFormOpen] = useState(false); const [feedback, setFeedback] = useState(null); const refresh = () => setTables(tableService.list()); const close = () => { setEditing(null); setFormOpen(false); };
  return <Stack spacing={3}>
    <PageHeader eyebrow="Restaurant floor" title="Tables" description="Manage seating capacity, dining sections, reservations, cleaning, and occupancy." actions={<Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setFormOpen(true)}>Add table</Button>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Tables" value={tables.length} helper="Floor positions" icon={Armchair} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Available" value={tables.filter((table) => table.status === 'available').length} helper="Ready to seat" icon={CircleCheck} tone="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Occupied" value={tables.filter((table) => table.status === 'occupied').length} helper="Active service" icon={Users} tone="warning" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Cleaning" value={tables.filter((table) => table.status === 'cleaning').length} helper="Awaiting reset" icon={Sparkles} tone="neutral" /></Grid></Grid>
    <Grid container spacing={2}>{tables.map((table) => <Grid key={table.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}><Stack sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5, bgcolor: 'background.paper', height: '100%' }} spacing={2}><Stack direction="row" justifyContent="space-between"><Stack><Typography variant="h6" fontWeight={850}>{table.name}</Typography><Typography variant="body2" color="text.secondary">{table.section}</Typography></Stack><Chip size="small" color={colors[table.status]} label={table.status} /></Stack><Typography variant="body2"><Users size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Seats {table.capacity}</Typography><Stack direction="row" justifyContent="flex-end"><Tooltip title="Edit"><IconButton onClick={() => { setEditing(table); setFormOpen(true); }}><Pencil size={18} /></IconButton></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleting(table)}><Trash2 size={18} /></IconButton></Tooltip></Stack></Stack></Grid>)}</Grid>
    {formOpen ? <TableForm table={editing} actor={user} open={formOpen} onClose={close} onSaved={(_table, message) => { refresh(); close(); setFeedback({ severity: 'success', message }); }} /> : null}
    <ConfirmDialog open={Boolean(deleting)} title="Delete table?" description={`Delete ${deleting?.name ?? 'this table'}? Tables with order history cannot be removed.`} confirmLabel="Delete table" destructive onClose={() => setDeleting(null)} onConfirm={() => { try { tableService.remove(deleting.id, user); refresh(); setFeedback({ severity: 'success', message: 'Table deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } setDeleting(null); }} />
    <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
