import { Chip, Grid, Link, Stack, Typography } from '@mui/material';
import { Phone, Truck, UserCheck } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { supplierService } from '../../services/supplierService';

const supplierColumns = [
  {
    field: 'name',
    header: 'Supplier',
    minWidth: 220,
    renderCell: (value) => <Typography variant="body2" sx={{ fontWeight: 750 }}>{value}</Typography>,
  },
  { field: 'contact', header: 'Primary contact', minWidth: 170 },
  {
    field: 'phone',
    header: 'Phone',
    minWidth: 160,
    renderCell: (value) => <Link href={`tel:${value}`} underline="hover">{value}</Link>,
  },
  {
    field: 'email',
    header: 'Email',
    minWidth: 240,
    renderCell: (value) => <Link href={`mailto:${value}`} underline="hover">{value}</Link>,
  },
  {
    field: 'status',
    header: 'Status',
    minWidth: 110,
    renderCell: (value) => <Chip size="small" color={value === 'active' ? 'success' : 'default'} label={value === 'active' ? 'Active' : 'Inactive'} />,
  },
];

export function SuppliersPage() {
  const suppliers = supplierService.list();
  const activeSuppliers = suppliers.filter((supplier) => supplier.status === 'active').length;
  const contactCoverage = suppliers.filter((supplier) => supplier.phone || supplier.email).length;

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Procurement"
        title="Suppliers"
        description="Maintain vendor contacts and the foundation for purchase and receiving history."
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Suppliers" value={suppliers.length} helper="Vendor records" icon={Truck} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Active vendors" value={activeSuppliers} helper="Available for purchasing" icon={UserCheck} tone="success" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Contact coverage" value={`${contactCoverage}/${suppliers.length}`} helper="Phone or email available" icon={Phone} tone="neutral" /></Grid>
      </Grid>
      <DataTable
        title="Vendor directory"
        description={`${suppliers.length} supplier records in the local database`}
        rows={suppliers}
        columns={supplierColumns}
        searchPlaceholder="Search suppliers"
        emptyTitle="No suppliers found"
        initialSort={{ field: 'name', direction: 'asc' }}
      />
    </Stack>
  );
}

