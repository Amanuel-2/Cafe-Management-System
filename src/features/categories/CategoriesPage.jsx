import { Alert, Button, Chip, Grid, IconButton, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Layers3, Pencil, Plus, Tags, Trash2, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../services/categoryService';

const schema = z.object({ name: z.string().trim().min(2, 'Name must contain at least 2 characters.'), type: z.enum(['food', 'drink', 'mixed']), status: z.enum(['active', 'inactive']) });
const defaults = { name: '', type: 'food', status: 'active' };

function CategoryForm({ category, actor, open, onClose, onSaved }) {
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm({ values: category ? { ...defaults, ...category } : defaults });
  const submit = async (values) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) { parsed.error.issues.forEach((issue) => issue.path[0] && setError(issue.path[0], { message: issue.message })); return; }
    try {
      const saved = category ? categoryService.update(category.id, parsed.data, actor) : categoryService.create(parsed.data, actor);
      onSaved(saved, category ? 'Category updated.' : 'Category created.');
    } catch (error) { setError('name', { message: error instanceof Error ? error.message : 'Unable to save category.' }); }
  };
  return <FormDialog open={open} title={category ? 'Edit category' : 'Add category'} description="Categories organize menu browsing across staff and public ordering surfaces." submitLabel={category ? 'Save changes' : 'Create category'} onClose={onClose} onSubmit={handleSubmit(submit)} isSubmitting={isSubmitting}>
    <Controller name="name" control={control} render={({ field, fieldState }) => <TextField {...field} label="Category name" required error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth />} />
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6 }}><Controller name="type" control={control} render={({ field }) => <TextField {...field} select label="Category type" fullWidth><MenuItem value="food">Food</MenuItem><MenuItem value="drink">Drink</MenuItem><MenuItem value="mixed">Mixed</MenuItem></TextField>} /></Grid><Grid size={{ xs: 12, sm: 6 }}><Controller name="status" control={control} render={({ field }) => <TextField {...field} select label="Status" fullWidth><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></TextField>} /></Grid></Grid>
  </FormDialog>;
}

export function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState(() => categoryService.list());
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const refresh = () => setCategories(categoryService.list());
  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const columns = [
    { field: 'name', header: 'Category', minWidth: 220, renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography> },
    { field: 'type', header: 'Type', minWidth: 100, renderCell: (value) => <Chip size="small" label={value[0].toUpperCase() + value.slice(1)} /> },
    { field: 'items', header: 'Items', minWidth: 100, getValue: (category) => categoryService.getItemCount(category.id), renderCell: (value) => `${value} items` },
    { field: 'sortOrder', header: 'Order', minWidth: 90 },
    { field: 'status', header: 'Status', minWidth: 100, renderCell: (value) => <Chip size="small" color={value === 'active' ? 'success' : 'default'} label={value === 'active' ? 'Active' : 'Inactive'} /> },
    { field: 'actions', header: 'Actions', sortable: false, searchable: false, align: 'right', minWidth: 110, renderCell: (_value, category) => { const itemCount = categoryService.getItemCount(category.id); return <Stack direction="row" justifyContent="flex-end" spacing={0.5}><Tooltip title="Edit category"><IconButton aria-label={`Edit ${category.name}`} onClick={() => { setEditing(category); setFormOpen(true); }}><Pencil size={18} /></IconButton></Tooltip><Tooltip title={itemCount ? 'Move or delete assigned items first' : 'Delete category'}><span><IconButton disabled={itemCount > 0} color="error" aria-label={`Delete ${category.name}`} onClick={() => setDeleting(category)}><Trash2 size={18} /></IconButton></span></Tooltip></Stack>; } },
  ];
  const active = categories.filter((category) => category.status === 'active').length;
  const itemCount = categories.reduce((total, category) => total + categoryService.getItemCount(category.id), 0);
  return <Stack spacing={3}>
    <PageHeader eyebrow="Catalog" title="Category management" description="Organize food and drinks into searchable groups used throughout the restaurant system." action={<Stack direction="row" spacing={1}><Button component={Link} to="/admin/menu" variant="outlined">Back to menu</Button><Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add category</Button></Stack>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Categories" value={categories.length} helper={`${active} active`} icon={Tags} /></Grid><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Menu items" value={itemCount} helper="Items assigned" icon={UtensilsCrossed} tone="success" /></Grid><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Category types" value={new Set(categories.map((category) => category.type)).size} helper="Food, drink, or mixed" icon={Layers3} tone="neutral" /></Grid></Grid>
    <DataTable title="Menu categories" description="Category records in display order" rows={categories} columns={columns} searchPlaceholder="Search categories" emptyTitle="No categories found" initialSort={{ field: 'sortOrder', direction: 'asc' }} />
    <CategoryForm key={editing?.id ?? 'new-category'} category={editing} actor={user} open={formOpen} onClose={closeForm} onSaved={(_category, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} />
    <ConfirmDialog open={Boolean(deleting)} title="Delete category?" description={deleting ? `Delete ${deleting.name}? Categories containing menu items cannot be deleted.` : ''} confirmLabel="Delete category" destructive onClose={() => setDeleting(null)} onConfirm={() => { try { categoryService.remove(deleting.id, user); refresh(); setFeedback({ severity: 'success', message: 'Category deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } finally { setDeleting(null); } }} />
    <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}

