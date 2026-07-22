import {
  Alert,
  Avatar,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Pencil, Plus, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { employeeService } from '../../services/employeeService';
import { roleService } from '../../services/roleService';

const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const employeeSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a valid phone number.'),
  role: z.string().min(1, 'Choose a role.'),
  status: z.enum(['active', 'inactive']),
  password: z.string(),
});

const emptyEmployee = {
  name: '',
  email: '',
  phone: '',
  role: 'Waiter',
  status: 'active',
  password: '123456',
};

function EmployeeForm({ employee, open, onClose, onSaved, actor }) {
  const isEditing = Boolean(employee);
  const isSystemAdmin = employee?.userId === 'user-admin';
  const roles = roleService.list().filter((role) => role.status === 'active');
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm({
    values: employee ? { ...emptyEmployee, ...employee, password: '' } : emptyEmployee,
  });

  const submit = async (values) => {
    const parsed = employeeSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) setError(field, { message: issue.message });
      });
      return;
    }
    if (!isEditing && parsed.data.password.length < 6) {
      setError('password', { message: 'Password must contain at least 6 characters.' });
      return;
    }
    if (isEditing && parsed.data.password && parsed.data.password.length < 6) {
      setError('password', { message: 'A new password must contain at least 6 characters.' });
      return;
    }

    try {
      const savedEmployee = isEditing
        ? employeeService.update(employee.id, parsed.data, actor)
        : employeeService.create(parsed.data, actor);
      onSaved(savedEmployee, isEditing ? 'Employee updated.' : 'Employee created.');
    } catch (error) {
      setError('email', { message: error instanceof Error ? error.message : 'Unable to save employee.' });
    }
  };

  const field = (name, label, options = {}) => (
    <Controller
      name={name}
      control={control}
      render={({ field: input, fieldState }) => (
        <TextField
          {...input}
          label={label}
          type={options.type}
          autoComplete={options.autoComplete}
          disabled={options.disabled}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? options.helperText}
          required={options.required}
          fullWidth
        />
      )}
    />
  );

  return (
    <FormDialog
      open={open}
      title={isEditing ? 'Edit employee' : 'Add employee'}
      description={isEditing ? 'Update the employee profile and account access.' : 'Create a staff profile and its sign-in account.'}
      submitLabel={isEditing ? 'Save changes' : 'Create employee'}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
      isSubmitting={isSubmitting}
    >
      {field('name', 'Full name', { required: true, autoComplete: 'name' })}
      {field('email', 'Email address', { required: true, type: 'email', autoComplete: 'email', disabled: isSystemAdmin })}
      {field('phone', 'Phone number', { required: true, autoComplete: 'tel' })}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="role"
            control={control}
            render={({ field: input, fieldState }) => (
              <TextField {...input} select label="Role" disabled={isSystemAdmin} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth>
                {roles.map((role) => <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>)}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="status"
            control={control}
            render={({ field: input, fieldState }) => (
              <TextField {...input} select label="Account status" disabled={isSystemAdmin} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth>
                {statuses.map((status) => <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>)}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      {field('password', isEditing ? 'New password' : 'Temporary password', {
        required: !isEditing,
        type: 'password',
        autoComplete: 'new-password',
        helperText: isEditing ? 'Leave blank to keep the current password.' : 'At least 6 characters.',
      })}
    </FormDialog>
  );
}

export function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState(() => employeeService.list());
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const activeCount = employees.filter((employee) => employee.status === 'active').length;
  const inactiveCount = employees.length - activeCount;

  const refresh = () => setEmployees(employeeService.list());
  const openCreate = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };
  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const columns = [
    {
      field: 'name',
      header: 'Employee',
      minWidth: 220,
      renderCell: (value) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14, fontWeight: 800 }}>
            {value.split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 750 }}>{value}</Typography>
        </Stack>
      ),
    },
    { field: 'role', header: 'Role', minWidth: 120 },
    { field: 'email', header: 'Email', minWidth: 220 },
    { field: 'phone', header: 'Phone', minWidth: 150 },
    {
      field: 'status',
      header: 'Status',
      minWidth: 110,
      renderCell: (value) => <Chip size="small" color={value === 'active' ? 'success' : 'default'} label={value === 'active' ? 'Active' : 'Inactive'} />,
    },
    {
      field: 'actions',
      header: 'Actions',
      sortable: false,
      searchable: false,
      align: 'right',
      minWidth: 110,
      renderCell: (_value, employee) => {
        const protectedAccount = employeeService.isProtected(employee, user);
        return (
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Edit employee"><IconButton aria-label={`Edit ${employee.name}`} onClick={() => openEdit(employee)}><Pencil size={18} /></IconButton></Tooltip>
            <Tooltip title={protectedAccount ? 'This active account cannot be deleted' : 'Delete employee'}>
              <span>
                <IconButton disabled={protectedAccount} color="error" aria-label={`Delete ${employee.name}`} onClick={() => setDeleteEmployee(employee)}>
                  <Trash2 size={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="People and access"
        title="Employee management"
        description="Manage staff profiles, role assignments, and account status from one directory."
        action={<Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>Add employee</Button>}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Total staff" value={employees.length} helper="Team members" icon={Users} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Active" value={activeCount} helper="Can access assigned workspace" icon={UserCheck} tone="success" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Inactive" value={inactiveCount} helper="Access disabled" icon={UserX} tone={inactiveCount ? 'warning' : 'neutral'} /></Grid>
      </Grid>
      <DataTable
        title="Staff directory"
        description={`${employees.length} employee records in the local database`}
        rows={employees}
        columns={columns}
        searchPlaceholder="Search employees"
        emptyTitle="No employees found"
        initialSort={{ field: 'name', direction: 'asc' }}
      />

      <EmployeeForm
        key={editingEmployee?.id ?? 'new-employee'}
        employee={editingEmployee}
        open={formOpen}
        actor={user}
        onClose={closeForm}
        onSaved={(_employee, message) => {
          refresh();
          closeForm();
          setFeedback({ severity: 'success', message });
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteEmployee)}
        title="Delete employee?"
        description={deleteEmployee ? `Delete ${deleteEmployee.name} and remove their sign-in account? This action cannot be undone.` : ''}
        confirmLabel="Delete employee"
        destructive
        onClose={() => setDeleteEmployee(null)}
        onConfirm={() => {
          try {
            employeeService.remove(deleteEmployee.id, user);
            refresh();
            setFeedback({ severity: 'success', message: 'Employee deleted.' });
          } catch (error) {
            setFeedback({ severity: 'error', message: error instanceof Error ? error.message : 'Unable to delete employee.' });
          } finally {
            setDeleteEmployee(null);
          }
        }}
      />
      <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert>
      </Snackbar>
    </Stack>
  );
}
