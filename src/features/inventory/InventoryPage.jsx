import { Chip, Grid, Stack, Typography } from '@mui/material';
import { AlertTriangle, Boxes, Package } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { inventoryService } from '../../services/inventoryService';
import { supplierService } from '../../services/supplierService';

export function InventoryPage() {
  const inventory = inventoryService.list();
  const suppliers = supplierService.list();
  const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const lowStockCount = inventory.filter((item) => item.stock <= (item.minimumStock ?? item.parLevel)).length;

  const columns = [
    {
      field: 'name',
      header: 'Ingredient',
      minWidth: 200,
      renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 750 }}>{value}</Typography>,
    },
    { field: 'category', header: 'Category', minWidth: 130 },
    {
      field: 'stock',
      header: 'Stock',
      minWidth: 110,
      getValue: (row) => row.stock,
      renderCell: (value, row) => `${value} ${row.unit}`,
    },
    {
      field: 'minimumStock',
      header: 'Minimum',
      minWidth: 110,
      getValue: (row) => row.minimumStock ?? row.parLevel,
      renderCell: (value, row) => `${value} ${row.unit}`,
    },
    {
      field: 'supplierId',
      header: 'Supplier',
      minWidth: 190,
      getValue: (row) => supplierMap.get(row.supplierId)?.name ?? 'Unknown',
    },
    { field: 'expirationDate', header: 'Expiration', minWidth: 130 },
    {
      field: 'stockStatus',
      header: 'Status',
      minWidth: 120,
      getValue: (row) => row.stock <= (row.minimumStock ?? row.parLevel) ? 'Low stock' : 'In stock',
      renderCell: (value) => <Chip size="small" color={value === 'Low stock' ? 'warning' : 'success'} label={value} />,
    },
  ];

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Stock control"
        title="Inventory"
        description="Track ingredient quantities, minimum levels, suppliers, and upcoming expiration dates."
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Inventory items" value={inventory.length} helper="Ingredients tracked" icon={Package} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Low stock" value={lowStockCount} helper="At or below minimum" icon={AlertTriangle} tone={lowStockCount ? 'warning' : 'success'} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Suppliers" value={suppliers.length} helper="Linked vendors" icon={Boxes} tone="neutral" /></Grid>
      </Grid>
      <DataTable
        title="Stock overview"
        description={`${inventory.length} ingredients in the local database`}
        rows={inventory}
        columns={columns}
        searchPlaceholder="Search inventory"
        emptyTitle="No inventory items found"
        initialSort={{ field: 'name', direction: 'asc' }}
      />
    </Stack>
  );
}
