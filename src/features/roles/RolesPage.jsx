import {
  Alert,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { KeyRound, Pencil, Plus, ShieldCheck, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DataTable } from '../../components/common/DataTable';
import { FormDialog } from '../../components/common/FormDialog';
import { MetricCard } from '../../components/common/MetricCard';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { permissionOptions, roleService, workspaceOptions } from '../../services/roleService';

const roleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must contain at least 2 characters.'),
  description: z.string().trim().min(2, 'Add a short role description.'),
  baseRole: z.enum(['admin', 'cashier', 'waiter', 'chef']),
  status: z.enum(['active', 'inactive']),
  permissions: z.array(z.string()).min(1, 'Select at least one permission.'),
});

const emptyRole = {
  name: '',
  description: '',
  baseRole: 'waiter',
  status: 'active',
  permissions: [],
};

function RoleForm({ role, open, actor, onClose, onSaved }) {
  const isEditing = Boolean(role);
  const { control, handleSubmit, setError, formState: { isSubmitting } } = useForm({
    values: role ? { ...emptyRole, ...role } : emptyRole,
  });

  const submit = async (values) => {
    const parsed = roleSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) setError(field, { message: issue.message });
      });
      return;
    }
    try {
      const savedRole = isEditing ? roleService.update(role.id, parsed.data, actor) : roleService.create(parsed.data, actor);
      onSaved(savedRole, isEditing ? 'Role updated.' : 'Role created.');
    } catch (error) {
      setError('name', { message: error instanceof Error ? error.message : 'Unable to save role.' });
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEditing ? 'Edit role' : 'Create role'}
      description="Choose the staff workspace and the actions this role is allowed to perform."
      submitLabel={isEditing ? 'Save changes' : 'Create role'}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
      isSubmitting={isSubmitting}
      maxWidth="md"
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField {...field} label="Role name" disabled={role?.system} required error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <TextField {...field} label="Description" multiline minRows={2} required error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth />
        )}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="baseRole"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} select label="Default workspace" disabled={role?.system} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth>
                {workspaceOptions.map((workspace) => <MenuItem key={workspace.value} value={workspace.value}>{workspace.label}</MenuItem>)}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} select label="Status" disabled={role?.system} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <Controller
        name="permissions"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={Boolean(fieldState.error)} component="fieldset" variant="standard">
            <Typography component="legend" sx={{ mb: 1, fontWeight: 800 }}>Permissions</Typography>
            <FormGroup>
              <Grid container>
                {permissionOptions.map((permission) => (
                  <Grid key={permission.value} size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value.includes(permission.value)}
                          onChange={(event) => {
                            const next = event.target.checked
                              ? [...field.value, permission.value]
                              : field.value.filter((value) => value !== permission.value);
                            field.onChange(next);
                          }}
                        />
                      }
                      label={permission.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
            {fieldState.error ? <FormHelperText>{fieldState.error.message}</FormHelperText> : null}
          </FormControl>
        )}
      />
    </FormDialog>
  );
}

export function RolesPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState(() => roleService.list());
  const [editingRole, setEditingRole] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteRole, setDeleteRole] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const refresh = () => setRoles(roleService.list());
  const closeForm = () => {
    setFormOpen(false);
    setEditingRole(null);
  };
  const openCreate = () => {
    setEditingRole(null);
    setFormOpen(true);
  };
  const openEdit = (role) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const columns = [
    {
      field: 'name', header: 'Role', minWidth: 190,
      renderCell: (value, role) => (
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{value}</Typography>
            {role.system ? <Chip size="small" label="System" variant="outlined" /> : null}
          </Stack>
          <Typography variant="caption" color="text.secondary">{role.description || 'No description'}</Typography>
        </Stack>
      ),
    },
    {
      field: 'baseRole', header: 'Workspace', minWidth: 150,
      renderCell: (value) => workspaceOptions.find((workspace) => workspace.value === value)?.label ?? value,
    },
    { field: 'permissions', header: 'Permissions', getValue: (role) => role.permissions.length, minWidth: 120, renderCell: (value) => `${value} granted` },
    { field: 'employees', header: 'Employees', getValue: (role) => roleService.getEmployeeCount(role), minWidth: 110 },
    { field: 'status', header: 'Status', minWidth: 100, renderCell: (value) => <Chip size="small" color={value === 'active' ? 'success' : 'default'} label={value === 'active' ? 'Active' : 'Inactive'} /> },
    {
      field: 'actions', header: 'Actions', sortable: false, searchable: false, align: 'right', minWidth: 110,
      renderCell: (_value, role) => {
        const assignedCount = roleService.getEmployeeCount(role);
        const cannotDelete = role.system || assignedCount > 0;
        const deleteReason = role.system ? 'System roles cannot be deleted' : assignedCount ? 'Reassign employees before deletion' : 'Delete role';
        return (
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Edit role"><IconButton aria-label={`Edit ${role.name}`} onClick={() => openEdit(role)}><Pencil size={18} /></IconButton></Tooltip>
            <Tooltip title={deleteReason}><span><IconButton disabled={cannotDelete} color="error" aria-label={`Delete ${role.name}`} onClick={() => setDeleteRole(role)}><Trash2 size={18} /></IconButton></span></Tooltip>
          </Stack>
        );
      },
    },
  ];

  const customRoles = roles.filter((role) => !role.system).length;
  const grantedPermissions = new Set(roles.flatMap((role) => role.permissions)).size;

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="People and access"
        title="Role management"
        description="Control staff workspaces and permissions while protecting the required system roles."
        action={<Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>Create role</Button>}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Roles" value={roles.length} helper={`${customRoles} custom roles`} icon={ShieldCheck} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Permissions" value={grantedPermissions} helper="Capabilities configured" icon={KeyRound} tone="success" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><MetricCard label="Assigned staff" value={roles.reduce((total, role) => total + roleService.getEmployeeCount(role), 0)} helper="Employees with roles" icon={Users} tone="neutral" /></Grid>
      </Grid>
      <DataTable title="Access roles" description="System and custom roles stored in the local database" rows={roles} columns={columns} searchPlaceholder="Search roles" emptyTitle="No roles found" initialSort={{ field: 'name', direction: 'asc' }} />
      <RoleForm key={editingRole?.id ?? 'new-role'} role={editingRole} open={formOpen} actor={user} onClose={closeForm} onSaved={(_role, message) => { refresh(); closeForm(); setFeedback({ severity: 'success', message }); }} />
      <ConfirmDialog
        open={Boolean(deleteRole)}
        title="Delete role?"
        description={deleteRole ? `Delete the ${deleteRole.name} role? This action cannot be undone.` : ''}
        confirmLabel="Delete role"
        destructive
        onClose={() => setDeleteRole(null)}
        onConfirm={() => {
          try {
            roleService.remove(deleteRole.id, user);
            refresh();
            setFeedback({ severity: 'success', message: 'Role deleted.' });
          } catch (error) {
            setFeedback({ severity: 'error', message: error instanceof Error ? error.message : 'Unable to delete role.' });
          } finally {
            setDeleteRole(null);
          }
        }}
      />
      <Snackbar open={Boolean(feedback)} autoHideDuration={3500} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)}>{feedback?.message}</Alert>
      </Snackbar>
    </Stack>
  );
}

