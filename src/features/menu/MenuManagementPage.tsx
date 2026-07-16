import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { StatCard } from '../../components/ui/StatCard';
import { Switch } from '../../components/ui/Switch';
import { Table, TableBody, TableHeader, Td, Th } from '../../components/ui/Table';
import { useMenuStore } from '../../store/menuStore';
import type { MenuItem } from '../../types/domain';
import { cn } from '../../utils/cn';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  categoryId: z.string().min(1, 'Choose a category'),
  price: z.number().positive('Price must be greater than 0'),
  prepTimeMinutes: z.number().int().positive('Prep time must be greater than 0'),
  image: z.string().url('Enter a valid image URL'),
  available: z.boolean(),
});

type MenuItemForm = z.infer<typeof menuItemSchema>;

const emptyValues: MenuItemForm = {
  name: '',
  categoryId: 'coffee',
  price: 0,
  prepTimeMinutes: 5,
  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80',
  available: true,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function MenuManagementPage() {
  const { categories, menuItems, addMenuItem, updateMenuItem, removeMenuItem, setAvailability } = useMenuStore();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryOptions = categories.map((category) => ({ label: category.name, value: category.id }));
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = categoryId === 'all' || item.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    });
  }, [categoryId, menuItems, query]);

  const availableCount = menuItems.filter((item) => item.available).length;
  const averagePrice = menuItems.length
    ? menuItems.reduce((total, item) => total + item.price, 0) / menuItems.length
    : 0;

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Menu Management</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Maintain dishes, pricing, prep timing, and availability for service.</p>
        </div>
        <Button Icon={Plus} onClick={openCreateModal}>Add item</Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Menu items" value={String(menuItems.length)} change={`${availableCount} available`} />
        <StatCard label="Categories" value={String(categories.length)} change="Active menu groups" />
        <StatCard label="Average price" value={formatCurrency(averagePrice)} change="Across all items" />
      </section>

      <Card>
        <CardHeader className="flex-col items-stretch gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle>Catalog</CardTitle>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{filteredItems.length} items shown</p>
          </div>
          <div className="flex flex-col gap-3 md:w-auto md:min-w-[420px] md:flex-row">
            <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu items" />
            <Select
              aria-label="Category"
              options={[{ label: 'All categories', value: 'all' }, ...categoryOptions]}
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              className={cn('rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900', categoryId === 'all' && 'bg-stone-950 text-white dark:bg-white dark:text-stone-950')}
              onClick={() => setCategoryId('all')}
              type="button"
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn('rounded-lg px-4 py-2 text-sm font-medium hover:opacity-80', category.color, categoryId === category.id && 'ring-2 ring-stone-400 ring-offset-2 dark:ring-stone-500 dark:ring-offset-stone-950')}
                onClick={() => setCategoryId(category.id)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const category = categoryMap.get(item.categoryId);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-stone-950 dark:text-stone-50">{item.name}</h3>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{item.prepTimeMinutes} min prep</p>
                      </div>
                      <Badge>{formatCurrency(item.price)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={category?.color}>{category?.name ?? 'Uncategorized'}</Badge>
                      <Switch checked={item.available} onClick={() => setAvailability(item.id, !item.available)} aria-label={`Toggle ${item.name} availability`} />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline" Icon={Edit3} onClick={() => openEditModal(item)}>Edit</Button>
                      <Button variant="ghost" size="icon" Icon={Trash2} onClick={() => setDeleteItem(item)} aria-label={`Delete ${item.name}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800">
            <Table>
              <TableHeader>
                <tr>
                  <Th>Item</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Prep</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const category = categoryMap.get(item.categoryId);
                  return (
                    <tr key={item.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="h-11 w-11 rounded-lg object-cover" />
                          <span className="font-medium text-stone-950 dark:text-stone-50">{item.name}</span>
                        </div>
                      </Td>
                      <Td>{category?.name ?? 'Uncategorized'}</Td>
                      <Td>{formatCurrency(item.price)}</Td>
                      <Td>{item.prepTimeMinutes} min</Td>
                      <Td><Badge variant={item.available ? 'success' : 'neutral'}>{item.available ? 'Available' : 'Hidden'}</Badge></Td>
                      <Td>
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" Icon={Edit3} onClick={() => openEditModal(item)} aria-label={`Edit ${item.name}`} />
                          <Button size="icon" variant="ghost" Icon={Trash2} onClick={() => setDeleteItem(item)} aria-label={`Delete ${item.name}`} />
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <MenuItemModal
        categories={categoryOptions}
        item={editingItem}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          if (editingItem) {
            updateMenuItem(editingItem.id, values);
          } else {
            addMenuItem(values);
          }
          setIsModalOpen(false);
        }}
      />

      <ConfirmationDialog
        open={Boolean(deleteItem)}
        title="Delete menu item"
        description={deleteItem ? `Remove ${deleteItem.name} from the menu catalog? This only affects local mock data for now.` : ''}
        confirmLabel="Delete"
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) removeMenuItem(deleteItem.id);
          setDeleteItem(null);
        }}
      />
    </div>
  );
}

function MenuItemModal({
  categories,
  item,
  open,
  onClose,
  onSubmit,
}: {
  categories: Array<{ label: string; value: string }>;
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MenuItemForm) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<MenuItemForm>({ values: item ?? emptyValues });

  const available = watch('available');

  const submit = (values: MenuItemForm) => {
    const parsed = menuItemSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'name' || field === 'categoryId' || field === 'price' || field === 'prepTimeMinutes' || field === 'image' || field === 'available') {
          setError(field, { message: issue.message });
        }
      });
      return;
    }
    onSubmit(parsed.data);
    reset(emptyValues);
  };

  return (
    <Modal open={open} title={item ? 'Edit menu item' : 'Add menu item'} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <Input label="Item name" error={errors.name?.message} {...register('name')} />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Category" options={categories} {...register('categoryId')} />
          <Input label="Price" type="number" step="0.01" min="0" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
        </div>
        <Input label="Prep time minutes" type="number" min="1" error={errors.prepTimeMinutes?.message} {...register('prepTimeMinutes', { valueAsNumber: true })} />
        <Input label="Image URL" type="url" error={errors.image?.message} {...register('image')} />
        <div className="flex items-center justify-between rounded-lg border border-stone-200 p-3 dark:border-stone-800">
          <div>
            <p className="text-sm font-medium text-stone-950 dark:text-stone-50">Available for ordering</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Hidden items stay in the catalog but disappear from fast ordering later.</p>
          </div>
          <Switch checked={available} onClick={() => setValue('available', !available)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{item ? 'Save changes' : 'Create item'}</Button>
        </div>
      </form>
    </Modal>
  );
}
