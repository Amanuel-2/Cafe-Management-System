import { Alert, Button, Chip, Grid, IconButton, Link, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Pencil, Phone, Plus, Trash2, Truck, UserCheck, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { supplierService } from '../../services/supplierService';
import { formatETB } from '../../utils/currency';

const supplierSchema = z.object({ name: z.string().trim().min(2, 'Name must contain at least 2 characters.'), contact: z.string().trim().min(2, 'Contact person is required.'), phone: z.string().trim().min(7, 'Enter a valid phone number.'), email: z.email('Enter a valid email address.'), status: z.enum(['active', 'inactive']) });
const defaults = { name: '', contact: '', phone: '', email: '', status: 'active' };

function SupplierForm({ supplier, actor, open, onClose, onSaved }) {
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm({ values: supplier ? { ...defaults, ...supplier } : defaults });
  const submit = (values) => { const parsed = supplierSchema.safeParse(values); if (!parsed.success) { parsed.error.issues.forEach((issue) => setError(issue.path[0], { message: issue.message })); return; } try { const saved = supplier ? supplierService.update(supplier.id, parsed.data, actor) : supplierService.create(parsed.data, actor); onSaved(saved, supplier ? 'Supplier updated.' : 'Supplier created.'); } catch (error) { setError('name', { message: error.message }); } };
  const field = (name, label) => <Controller name={name} control={control} render={({ field: input, fieldState }) => <TextField {...input} label={label} required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} />;
  return <FormDialog open={open} title={supplier ? 'Edit supplier' : 'Add supplier'} description="Maintain vendor identity, contact details, and purchasing availability." submitLabel={supplier ? 'Save changes' : 'Create supplier'} onClose={onClose} onSubmit={handleSubmit(submit)} isSubmitting={isSubmitting}>
    {field('name', 'Supplier name')}{field('contact', 'Primary contact')}<Grid container spacing={2}><Grid size={{ xs: 12, sm: 6 }}>{field('phone', 'Phone')}</Grid><Grid size={{ xs: 12, sm: 6 }}>{field('email', 'Email')}</Grid></Grid>
    <Controller name="status" control={control} render={({ field: input }) => <TextField {...input} select label="Status" fullWidth><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></TextField>} />
  </FormDialog>;
}

export function SuppliersPage() {
  const { user } = useAuth(); const [suppliers, setSuppliers] = useState(() => supplierService.list()); const [editing, setEditing] = useState(null); const [deleting, setDeleting] = useState(null); const [formOpen, setFormOpen] = useState(false); const [feedback, setFeedback] = useState(null);
  const orders = purchaseOrderService.list(); const active = suppliers.filter((supplier) => supplier.status === 'active').length; const receivedSpend = orders.filter((order) => order.status === 'received').reduce((sum, order) => sum + order.total, 0); const refresh = () => setSuppliers(supplierService.list()); const closeForm = () => { setFormOpen(false); setEditing(null); };
  const columns = [
    { field: 'name', header: 'Supplier', minWidth: 210, renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography> }, { field: 'contact', header: 'Primary contact', minWidth: 160 },
    { field: 'phone', header: 'Phone', minWidth: 150, renderCell: (value) => <Link href={`tel:${value}`} underline="hover">{value}</Link> }, { field: 'email', header: 'Email', minWidth: 220, renderCell: (value) => <Link href={`mailto:${value}`} underline="hover">{value}</Link> },
    { field: 'purchaseCount', header: 'Purchases', minWidth: 100, getValue: (row) => orders.filter((order) => order.supplierId === row.id).length }, { field: 'spend', header: 'Received value', minWidth: 140, getValue: (row) => orders.filter((order) => order.supplierId === row.id && order.status === 'received').reduce((sum, order) => sum + order.total, 0), renderCell: (value) => formatETB(value) },
    { field: 'status', header: 'Status', minWidth: 100, renderCell: (value) => <Chip size="small" color={value === 'active' ? 'success' : 'default'} label={value === 'active' ? 'Active' : 'Inactive'} /> },
    { field: 'actions', header: 'Actions', minWidth: 100, sortable: false, renderCell: (_value, row) => <Stack direction="row"><Tooltip title="Edit"><IconButton onClick={() => { setEditing(row); setFormOpen(true); }}><Pencil size={17} /></IconButton></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleting(row)}><Trash2 size={17} /></IconButton></Tooltip></Stack> },
  ];
  return <Stack spacing={3}>
    <PageHeader eyebrow="Procurement" title="Suppliers" description="Maintain vendor contacts and review purchase history derived from received orders." actions={<Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setFormOpen(true)}>Add supplier</Button>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Suppliers" value={suppliers.length} helper="Vendor records" icon={Truck} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Active vendors" value={active} helper="Available for purchasing" icon={UserCheck} tone="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Purchase orders" value={orders.length} helper="All lifecycle states" icon={Phone} tone="neutral" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Received value" value={formatETB(receivedSpend)} helper="Completed purchasing" icon={WalletCards} tone="neutral" /></Grid></Grid>
    <DataTable title="Vendor directory" description={`${suppliers.length} suppliers with derived purchasing totals`} rows={suppliers} columns={columns} searchPlaceholder="Search suppliers" emptyTitle="No suppliers found" initialSort={{ field: 'name', direction: 'asc' }} />
    {formOpen ? <SupplierForm supplier={editing} actor={user} open={formOpen} onClose={closeForm} onSaved={(_supplier, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} /> : null}
    <ConfirmDialog open={Boolean(deleting)} title="Delete supplier?" description={`Delete ${deleting?.name ?? 'this supplier'}? Inventory assignments and purchase history will prevent unsafe deletion.`} confirmLabel="Delete supplier" destructive onClose={() => setDeleting(null)} onConfirm={() => { try { supplierService.remove(deleting.id, user); refresh(); setFeedback({ severity: 'success', message: 'Supplier deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } setDeleting(null); }} />
    <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
