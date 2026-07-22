import { Alert, Button, Chip, Grid, IconButton, MenuItem, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { ChefHat, Pencil, Plus, Trash2, UtensilsCrossed, Wheat } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { inventoryService } from '../../services/inventoryService';
import { menuService } from '../../services/menuService';
import { recipeService } from '../../services/recipeService';

const recipeSchema = z.object({
  name: z.string().trim().min(2, 'Recipe name must contain at least 2 characters.'),
  menuItemId: z.string().min(1, 'Choose a menu item.'),
  ingredients: z.array(z.object({
    inventoryItemId: z.string().min(1, 'Choose an ingredient.'),
    quantity: z.number().positive('Quantity must be greater than zero.'),
  })).min(1, 'Add at least one ingredient.'),
});

function RecipeForm({ recipe, recipes, menuItems, inventory, actor, open, onClose, onSaved }) {
  const isEditing = Boolean(recipe);
  const usedMenuIds = new Set(recipes.filter((entry) => entry.id !== recipe?.id).map((entry) => entry.menuItemId));
  const availableMenuItems = menuItems.filter((item) => !usedMenuIds.has(item.id));
  const { control, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm({
    values: recipe
      ? { name: recipe.name, menuItemId: recipe.menuItemId, ingredients: recipe.ingredients }
      : { name: '', menuItemId: availableMenuItems[0]?.id ?? '', ingredients: [{ inventoryItemId: inventory[0]?.id ?? '', quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });

  const submit = (values) => {
    const parsed = recipeSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => setError(issue.path.join('.'), { message: issue.message }));
      return;
    }
    try {
      const saved = isEditing
        ? recipeService.update(recipe.id, parsed.data, actor)
        : recipeService.create(parsed.data, actor);
      onSaved(saved, isEditing ? 'Recipe updated.' : 'Recipe created.');
    } catch (error) {
      setError('root', { message: error instanceof Error ? error.message : 'Unable to save recipe.' });
    }
  };

  return (
    <FormDialog open={open} title={isEditing ? 'Edit recipe' : 'Create recipe'} description="Map each menu item to measurable inventory usage." submitLabel={isEditing ? 'Save changes' : 'Create recipe'} onClose={onClose} onSubmit={handleSubmit(submit)} isSubmitting={isSubmitting} maxWidth="md">
      {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}><Controller name="name" control={control} render={({ field, fieldState }) => <TextField {...field} label="Recipe name" required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><Controller name="menuItemId" control={control} render={({ field, fieldState }) => <TextField {...field} select label="Menu item" required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message}>{availableMenuItems.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</TextField>} /></Grid>
      </Grid>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">Inventory ingredients</Typography>
          <Button size="small" startIcon={<Plus size={16} />} onClick={() => append({ inventoryItemId: inventory[0]?.id ?? '', quantity: 1 })}>Add ingredient</Button>
        </Stack>
        {fields.map((field, index) => (
          <Grid container spacing={1.5} alignItems="center" key={field.id}>
            <Grid size={{ xs: 12, sm: 7 }}><Controller name={`ingredients.${index}.inventoryItemId`} control={control} render={({ field: input, fieldState }) => <TextField {...input} select label="Ingredient" size="small" required fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message}>{inventory.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} ({item.unit})</MenuItem>)}</TextField>} /></Grid>
            <Grid size={{ xs: 10, sm: 4 }}><Controller name={`ingredients.${index}.quantity`} control={control} render={({ field: input, fieldState }) => <TextField {...input} label="Quantity per item" size="small" type="number" required fullWidth slotProps={{ htmlInput: { min: 0.001, step: 0.001 } }} onChange={(event) => input.onChange(Number(event.target.value))} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />} /></Grid>
            <Grid size={{ xs: 2, sm: 1 }}><Tooltip title="Remove ingredient"><span><IconButton color="error" disabled={fields.length === 1} onClick={() => remove(index)}><Trash2 size={18} /></IconButton></span></Tooltip></Grid>
          </Grid>
        ))}
        {errors.ingredients?.message || errors.ingredients?.root?.message ? <Alert severity="error">{errors.ingredients.message ?? errors.ingredients.root.message}</Alert> : null}
      </Stack>
    </FormDialog>
  );
}

export function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState(() => recipeService.list());
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteRecipe, setDeleteRecipe] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const menuItems = menuService.list();
  const inventory = inventoryService.list();
  const menuMap = new Map(menuItems.map((item) => [item.id, item]));
  const inventoryMap = new Map(inventory.map((item) => [item.id, item]));
  const mappedIngredientCount = new Set(recipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.inventoryItemId))).size;
  const unmappedMenuCount = menuItems.filter((item) => !recipes.some((recipe) => recipe.menuItemId === item.id)).length;
  const closeForm = () => { setFormOpen(false); setEditingRecipe(null); };
  const refresh = () => setRecipes(recipeService.list());

  const columns = [
    { field: 'name', header: 'Recipe', minWidth: 200, renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography> },
    { field: 'menuItemId', header: 'Menu item', minWidth: 180, getValue: (row) => menuMap.get(row.menuItemId)?.name ?? 'Unlinked' },
    { field: 'ingredients', header: 'Inventory usage per order', minWidth: 360, sortable: false, renderCell: (value) => <Stack direction="row" gap={0.75} flexWrap="wrap">{value.map((ingredient) => { const item = inventoryMap.get(ingredient.inventoryItemId); return <Chip key={ingredient.inventoryItemId} size="small" label={`${item?.name ?? 'Unknown'}: ${ingredient.quantity} ${item?.unit ?? ''}`} />; })}</Stack> },
    { field: 'componentCount', header: 'Components', minWidth: 110, getValue: (row) => row.ingredients.length },
    { field: 'actions', header: 'Actions', minWidth: 110, sortable: false, renderCell: (_value, row) => <Stack direction="row"><Tooltip title="Edit recipe"><IconButton onClick={() => { setEditingRecipe(row); setFormOpen(true); }}><Pencil size={17} /></IconButton></Tooltip><Tooltip title="Delete recipe"><IconButton color="error" onClick={() => setDeleteRecipe(row)}><Trash2 size={17} /></IconButton></Tooltip></Stack> },
  ];

  return (
    <Stack spacing={3}>
      <PageHeader eyebrow="Menu engineering" title="Recipes" description="Define exact ingredient quantities so completed orders can deduct inventory consistently." actions={<Button variant="contained" startIcon={<Plus size={18} />} disabled={!inventory.length || unmappedMenuCount === 0} onClick={() => setFormOpen(true)}>Create recipe</Button>} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Recipes" value={recipes.length} helper="Menu items documented" icon={ChefHat} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Mapped ingredients" value={mappedIngredientCount} helper="Unique inventory records" icon={Wheat} tone="success" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Awaiting recipes" value={unmappedMenuCount} helper="Menu items not mapped" icon={UtensilsCrossed} tone={unmappedMenuCount ? 'warning' : 'success'} /></Grid>
      </Grid>
      <DataTable title="Recipe mappings" description={`${recipes.length} recipes connected to inventory`} rows={recipes} columns={columns} searchPlaceholder="Search recipes" emptyTitle="No recipes configured" initialSort={{ field: 'name', direction: 'asc' }} />
      {formOpen ? <RecipeForm recipe={editingRecipe} recipes={recipes} menuItems={menuItems} inventory={inventory} actor={user} open={formOpen} onClose={closeForm} onSaved={(_saved, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} /> : null}
      <ConfirmDialog open={Boolean(deleteRecipe)} title="Delete recipe?" description={`Delete ${deleteRecipe?.name ?? 'this recipe'}? Its menu item will no longer deduct inventory.`} confirmLabel="Delete recipe" destructive onClose={() => setDeleteRecipe(null)} onConfirm={() => { try { recipeService.remove(deleteRecipe.id, user); refresh(); setFeedback({ severity: 'success', message: 'Recipe deleted.' }); } catch (error) { setFeedback({ severity: 'error', message: error.message }); } setDeleteRecipe(null); }} />
      <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert></Snackbar>
    </Stack>
  );
}
