import {
  Alert, Avatar, Button, Chip, FormControlLabel, Grid, IconButton, MenuItem, Snackbar, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';
import { Eye, EyeOff, ImagePlus, Pencil, Plus, Tags, Trash2, UtensilsCrossed, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../services/categoryService';
import { menuService } from '../../services/menuService';
import { formatETB } from '../../utils/currency';

const itemSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.'),
  description: z.string().trim().min(5, 'Description must contain at least 5 characters.'),
  categoryId: z.string().min(1, 'Choose a category.'),
  type: z.enum(['food', 'drink']),
  price: z.number().positive('Price must be greater than zero.'),
  prepTimeMinutes: z.number().int().positive('Preparation time must be at least one minute.'),
  image: z.string().min(1, 'Choose an image or keep the default image.'),
  available: z.boolean(),
});

const defaultItem = {
  name: '', description: '', categoryId: '', type: 'food', price: 0, prepTimeMinutes: 10, image: '/favicon.svg', available: true,
};

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Choose a valid image file.'));
    if (file.size > 1_500_000) return reject(new Error('Image size must be 1.5 MB or smaller.'));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read this image.'));
    reader.readAsDataURL(file);
  });
}

function MenuItemForm({ item, categories, actor, open, onClose, onSaved }) {
  const isEditing = Boolean(item);
  const { control, handleSubmit, setError, setValue, formState: { isSubmitting } } = useForm({
    values: item ? { ...defaultItem, ...item } : { ...defaultItem, categoryId: categories[0]?.id ?? '' },
  });
  const image = useWatch({ control, name: 'image' });

  const submit = async (values) => {
    const parsed = itemSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => issue.path[0] && setError(issue.path[0], { message: issue.message }));
      return;
    }
    try {
      const saved = isEditing ? menuService.update(item.id, parsed.data, actor) : menuService.create(parsed.data, actor);
      onSaved(saved, isEditing ? 'Menu item updated.' : 'Menu item created.');
    } catch (error) {
      setError('name', { message: error instanceof Error ? error.message : 'Unable to save menu item.' });
    }
  };

  const textField = (name, label, options = {}) => (
    <Controller name={name} control={control} render={({ field, fieldState }) => (
      <TextField {...field} label={label} type={options.type} multiline={options.multiline} minRows={options.minRows} required error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth
        onChange={options.number ? (event) => field.onChange(Number(event.target.value)) : field.onChange} inputProps={options.inputProps} />
    )} />
  );

  return (
    <FormDialog open={open} title={isEditing ? 'Edit menu item' : 'Add menu item'} description="Maintain item details used by staff ordering, POS, and the public menu." submitLabel={isEditing ? 'Save changes' : 'Create item'} onClose={onClose} onSubmit={handleSubmit(submit)} isSubmitting={isSubmitting} maxWidth="md">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}><Stack spacing={2}>
          {textField('name', 'Item name')}
          {textField('description', 'Description', { multiline: true, minRows: 3 })}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="categoryId" control={control} render={({ field, fieldState }) => <TextField {...field} select label="Category" required error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth>{categories.filter((category) => category.status === 'active').map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}</TextField>} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Controller name="type" control={control} render={({ field }) => <TextField {...field} select label="Item type" fullWidth><MenuItem value="food">Food</MenuItem><MenuItem value="drink">Drink</MenuItem></TextField>} /></Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>{textField('price', 'Price (ETB)', { type: 'number', number: true, inputProps: { min: 0, step: 0.01 } })}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>{textField('prepTimeMinutes', 'Preparation minutes', { type: 'number', number: true, inputProps: { min: 1, step: 1 } })}</Grid>
          </Grid>
          <Controller name="available" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(_event, checked) => field.onChange(checked)} />} label="Available for ordering" />} />
        </Stack></Grid>
        <Grid size={{ xs: 12, md: 5 }}><Stack spacing={2}>
          <Avatar variant="rounded" src={image} alt="Menu item preview" sx={{ width: '100%', height: 220, bgcolor: 'action.hover' }}><UtensilsCrossed /></Avatar>
          <Button component="label" variant="outlined" startIcon={<ImagePlus size={18} />}>Upload image<input hidden type="file" accept="image/*" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { setValue('image', await readImage(file), { shouldValidate: true }); } catch (error) { setError('image', { message: error.message }); } event.target.value = ''; }} /></Button>
          <Controller name="image" control={control} render={({ fieldState }) => fieldState.error ? <Alert severity="error">{fieldState.error.message}</Alert> : <Typography variant="caption" color="text.secondary">PNG, JPG, or WebP up to 1.5 MB. The image is saved in localStorage.</Typography>} />
        </Stack></Grid>
      </Grid>
    </FormDialog>
  );
}

export function MenuManagementPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(() => menuService.list());
  const [categories, setCategories] = useState(() => categoryService.list());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const visibleItems = categoryFilter === 'all' ? items : items.filter((item) => item.categoryId === categoryFilter);
  const availableCount = items.filter((item) => item.available).length;
  const averagePrice = items.length ? items.reduce((total, item) => total + item.price, 0) / items.length : 0;
  const refresh = () => { setItems(menuService.list()); setCategories(categoryService.list()); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const columns = [
    { field: 'name', header: 'Item', minWidth: 230, renderCell: (value, item) => <Stack direction="row" alignItems="center" spacing={1.5}><Avatar variant="rounded" src={item.image} sx={{ width: 44, height: 44 }}><UtensilsCrossed size={18} /></Avatar><Stack><Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{item.description}</Typography></Stack></Stack> },
    { field: 'categoryId', header: 'Category', minWidth: 140, getValue: (item) => categoryMap.get(item.categoryId)?.name ?? 'Unknown' },
    { field: 'type', header: 'Type', minWidth: 90, renderCell: (value) => <Chip size="small" label={value === 'drink' ? 'Drink' : 'Food'} /> },
    { field: 'price', header: 'Price', minWidth: 110, renderCell: (value) => formatETB(value) },
    { field: 'prepTimeMinutes', header: 'Prep', minWidth: 90, renderCell: (value) => `${value} min` },
    { field: 'available', header: 'Status', minWidth: 110, getValue: (item) => item.available ? 'Available' : 'Hidden', renderCell: (_value, item) => <Chip size="small" color={item.available ? 'success' : 'default'} label={item.available ? 'Available' : 'Hidden'} /> },
    { field: 'actions', header: 'Actions', sortable: false, searchable: false, align: 'right', minWidth: 150, renderCell: (_value, item) => <Stack direction="row" justifyContent="flex-end" spacing={0.5}><Tooltip title={item.available ? 'Hide item' : 'Make available'}><IconButton aria-label={`Toggle ${item.name} availability`} onClick={() => { try { menuService.setAvailability(item.id, !item.available, user); refresh(); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } }}>{item.available ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></Tooltip><Tooltip title="Edit item"><IconButton aria-label={`Edit ${item.name}`} onClick={() => { setEditingItem(item); setFormOpen(true); }}><Pencil size={18} /></IconButton></Tooltip><Tooltip title="Delete item"><IconButton color="error" aria-label={`Delete ${item.name}`} onClick={() => setDeleteItem(item)}><Trash2 size={18} /></IconButton></Tooltip></Stack> },
  ];

  return <Stack spacing={3}>
    <PageHeader eyebrow="Catalog" title="Menu management" description="Maintain food and drink details used across POS, waiter ordering, kitchen, and the public menu." action={<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><Button component={Link} to="/admin/categories" variant="outlined" startIcon={<Tags size={18} />}>Categories</Button><Button variant="contained" startIcon={<Plus size={18} />} onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add item</Button></Stack>} />
    <Grid container spacing={2}><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Menu items" value={items.length} helper={`${availableCount} available`} icon={UtensilsCrossed} /></Grid><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Categories" value={categories.length} helper="Catalog groups" icon={Tags} tone="neutral" /></Grid><Grid size={{ xs: 12, md: 4 }}><MetricCard label="Average price" value={formatETB(averagePrice)} helper="Across all items" icon={WalletCards} tone="success" /></Grid></Grid>
    <TextField select size="small" label="Category filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} sx={{ width: { xs: '100%', sm: 260 } }}><MenuItem value="all">All categories</MenuItem>{categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}</TextField>
    <DataTable title="Menu catalog" description={`${visibleItems.length} items shown`} rows={visibleItems} columns={columns} searchPlaceholder="Search menu items" emptyTitle="No menu items found" initialSort={{ field: 'name', direction: 'asc' }} />
    <MenuItemForm key={editingItem?.id ?? 'new-item'} item={editingItem} categories={categories} actor={user} open={formOpen} onClose={closeForm} onSaved={(_item, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} />
    <ConfirmDialog open={Boolean(deleteItem)} title="Delete menu item?" description={deleteItem ? `Delete ${deleteItem.name}? Linked recipes must be removed first.` : ''} confirmLabel="Delete item" destructive onClose={() => setDeleteItem(null)} onConfirm={() => { try { menuService.remove(deleteItem.id, user); refresh(); setFeedback({ severity: 'success', message: 'Menu item deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } finally { setDeleteItem(null); } }} />
    <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
  </Stack>;
}
