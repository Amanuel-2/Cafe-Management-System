import { Alert, Button, Chip, Grid, IconButton, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { AlertTriangle, Boxes, Package, Pencil, Plus, RefreshCw, Trash2, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { inventoryService } from '../../services/inventoryService';
import { supplierService } from '../../services/supplierService';
import { formatETB } from '../../utils/currency';

const inventorySchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.'), category: z.string().trim().min(2, 'Category is required.'), unit: z.string().trim().min(1, 'Unit is required.'),
  stock: z.number().nonnegative('Stock cannot be negative.'), minimumStock: z.number().nonnegative('Minimum cannot be negative.'), cost: z.number().nonnegative('Cost cannot be negative.'),
  supplierId: z.string(), expirationDate: z.string(),
});

const defaultItem = { name: '', category: '', unit: 'kg', stock: 0, minimumStock: 0, cost: 0, supplierId: '', expirationDate: '' };

function InventoryForm({ item, suppliers, actor, open, onClose, onSaved }) {
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm({ values: item ? { ...defaultItem, ...item } : defaultItem });
  const submit = (values) => {
    const parsed = inventorySchema.safeParse(values);
    if (!parsed.success) { parsed.error.issues.forEach((issue) => setError(issue.path[0], { message: issue.message })); return; }
    try { const saved = item ? inventoryService.update(item.id, parsed.data, actor) : inventoryService.create(parsed.data, actor); onSaved(saved, item ? 'Inventory item updated.' : 'Inventory item created.'); }
    catch (error) { setError('name', { message: error.message }); }
  };
  const text = (name, label, options = {}) => <Controller name={name} control={control} render={({ field, fieldState }) => <TextField {...field} label={label} type={options.type} required={options.required !== false} fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} slotProps={options.slotProps} onChange={options.number ? (event) => field.onChange(Number(event.target.value)) : field.onChange} />} />;
  return <FormDialog open={open} title={item ? 'Edit inventory item' : 'Add inventory item'} description="Maintain quantities, replenishment levels, costing, supplier, and shelf life." submitLabel={item ? 'Save changes' : 'Create item'} onClose={onClose} onSubmit={handleSubmit(submit)} isSubmitting={isSubmitting} maxWidth="md">
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>{text('name', 'Ingredient name')}</Grid><Grid size={{ xs: 12, md: 6 }}>{text('category', 'Category')}</Grid>
      <Grid size={{ xs: 12, sm: 4 }}>{text('unit', 'Unit')}</Grid><Grid size={{ xs: 12, sm: 4 }}>{text('stock', 'Current stock', { type: 'number', number: true, slotProps: { htmlInput: { min: 0, step: 0.001 } } })}</Grid><Grid size={{ xs: 12, sm: 4 }}>{text('minimumStock', 'Minimum stock', { type: 'number', number: true, slotProps: { htmlInput: { min: 0, step: 0.001 } } })}</Grid>
      <Grid size={{ xs: 12, md: 4 }}>{text('cost', 'Unit cost (ETB)', { type: 'number', number: true, slotProps: { htmlInput: { min: 0, step: 0.01 } } })}</Grid>
      <Grid size={{ xs: 12, md: 4 }}><Controller name="supplierId" control={control} render={({ field }) => <TextField {...field} select label="Supplier" fullWidth><MenuItem value="">Unassigned</MenuItem>{suppliers.filter((supplier) => supplier.status === 'active' || supplier.id === item?.supplierId).map((supplier) => <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>)}</TextField>} /></Grid>
      <Grid size={{ xs: 12, md: 4 }}>{text('expirationDate', 'Expiration date', { type: 'date', required: false, slotProps: { inputLabel: { shrink: true } } })}</Grid>
    </Grid>
  </FormDialog>;
}

function AdjustmentForm({ item, actor, open, onClose, onSaved }) {
  const { control, handleSubmit, setError } = useForm({ defaultValues: { quantity: 0, reason: '' } });
  const submit = (values) => { try { inventoryService.adjustStock(item.id, values.quantity, values.reason, actor); onSaved('Stock adjustment recorded.'); } catch (error) { setError('quantity', { message: error.message }); } };
  return <FormDialog open={open} title={`Adjust ${item.name}`} description={`Current balance: ${item.stock} ${item.unit}. Use a negative quantity to record waste or correction.`} submitLabel="Record adjustment" onClose={onClose} onSubmit={handleSubmit(submit)}>
    <Controller name="quantity" control={control} render={({ field, fieldState }) => <TextField {...field} label="Adjustment quantity" type="number" required fullWidth onChange={(event) => field.onChange(Number(event.target.value))} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} />
    <Controller name="reason" control={control} render={({ field }) => <TextField {...field} label="Reason" required fullWidth multiline minRows={2} />} />
  </FormDialog>;
}

function expirationStatus(date) {
  if (!date) return { label: 'No date', color: 'default' };
  const days = Math.ceil((new Date(`${date}T23:59:59`) - new Date()) / 86400000);
  if (days < 0) return { label: 'Expired', color: 'error' };
  if (days <= 7) return { label: `${days}d left`, color: 'warning' };
  return { label: date, color: 'success' };
}

export function InventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState(() => inventoryService.list());
  const [editing, setEditing] = useState(null); const [adjusting, setAdjusting] = useState(null); const [deleting, setDeleting] = useState(null); const [formOpen, setFormOpen] = useState(false); const [feedback, setFeedback] = useState(null);
  const suppliers = supplierService.list(); const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const lowStockCount = inventory.filter((item) => item.stock <= item.minimumStock).length; const expiringCount = inventory.filter((item) => ['Expired'].includes(expirationStatus(item.expirationDate).label) || expirationStatus(item.expirationDate).color === 'warning').length;
  const totalValue = inventory.reduce((sum, item) => sum + item.stock * (item.cost ?? 0), 0); const refresh = () => setInventory(inventoryService.list()); const closeForm = () => { setFormOpen(false); setEditing(null); };
  const columns = [
    { field: 'name', header: 'Ingredient', minWidth: 190, renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography> }, { field: 'category', header: 'Category', minWidth: 120 },
    { field: 'stock', header: 'Stock', minWidth: 120, renderCell: (value, row) => `${value} ${row.unit}` }, { field: 'minimumStock', header: 'Minimum', minWidth: 110, renderCell: (value, row) => `${value} ${row.unit}` },
    { field: 'cost', header: 'Unit cost', minWidth: 110, renderCell: (value) => formatETB(value ?? 0) }, { field: 'supplierId', header: 'Supplier', minWidth: 180, getValue: (row) => supplierMap.get(row.supplierId)?.name ?? 'Unassigned' },
    { field: 'expirationDate', header: 'Expiration', minWidth: 120, renderCell: (value) => { const status = expirationStatus(value); return <Chip size="small" color={status.color} label={status.label} />; } },
    { field: 'stockStatus', header: 'Status', minWidth: 110, getValue: (row) => row.stock <= row.minimumStock ? 'Low stock' : 'In stock', renderCell: (value) => <Chip size="small" color={value === 'Low stock' ? 'warning' : 'success'} label={value} /> },
    { field: 'actions', header: 'Actions', minWidth: 145, sortable: false, renderCell: (_value, row) => <Stack direction="row"><Tooltip title="Adjust stock"><IconButton onClick={() => setAdjusting(row)}><RefreshCw size={17} /></IconButton></Tooltip><Tooltip title="Edit"><IconButton onClick={() => { setEditing(row); setFormOpen(true); }}><Pencil size={17} /></IconButton></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleting(row)}><Trash2 size={17} /></IconButton></Tooltip></Stack> },
  ];
  return <Stack spacing={3}>
    <PageHeader eyebrow="Stock control" title="Inventory" description="Track ingredient balances, costs, suppliers, minimum levels, and shelf life." actions={<Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setFormOpen(true)}>Add ingredient</Button>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Inventory items" value={inventory.length} helper="Ingredients tracked" icon={Package} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Low stock" value={lowStockCount} helper="At or below minimum" icon={AlertTriangle} tone={lowStockCount ? 'warning' : 'success'} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Expiring soon" value={expiringCount} helper="Expired or within 7 days" icon={Boxes} tone={expiringCount ? 'warning' : 'success'} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Stock value" value={formatETB(totalValue)} helper="Quantity × unit cost" icon={WalletCards} tone="neutral" /></Grid></Grid>
    <DataTable title="Stock overview" description={`${inventory.length} ingredients in the local database`} rows={inventory} columns={columns} searchPlaceholder="Search inventory" emptyTitle="No inventory items found" initialSort={{ field: 'name', direction: 'asc' }} />
    {formOpen ? <InventoryForm item={editing} suppliers={suppliers} actor={user} open={formOpen} onClose={closeForm} onSaved={(_item, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} /> : null}
    {adjusting ? <AdjustmentForm item={adjusting} actor={user} open={Boolean(adjusting)} onClose={() => setAdjusting(null)} onSaved={(message) => { refresh(); setAdjusting(null); setFeedback({ severity: 'success', message }); }} /> : null}
    <ConfirmDialog open={Boolean(deleting)} title="Delete inventory item?" description={`Delete ${deleting?.name ?? 'this item'}? Recipe and purchase references will prevent unsafe deletion.`} confirmLabel="Delete item" destructive onClose={() => setDeleting(null)} onConfirm={() => { try { inventoryService.remove(deleting.id, user); refresh(); setFeedback({ severity: 'success', message: 'Inventory item deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } setDeleting(null); }} />
    <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
