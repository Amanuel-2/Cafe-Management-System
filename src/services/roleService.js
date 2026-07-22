import { PERMISSION, ROLE_PERMISSIONS } from '../routes/access.js';
import { database } from './database.js';

export const permissionOptions = [
  { value: PERMISSION.MANAGE_EMPLOYEES, label: 'Manage employees' },
  { value: PERMISSION.MANAGE_MENU, label: 'Manage menu' },
  { value: PERMISSION.MANAGE_INVENTORY, label: 'Manage inventory' },
  { value: PERMISSION.MANAGE_SETTINGS, label: 'Manage settings' },
  { value: PERMISSION.VIEW_REPORTS, label: 'View reports' },
  { value: PERMISSION.CREATE_ORDER, label: 'Create orders' },
  { value: PERMISSION.MANAGE_ORDERS, label: 'Manage orders' },
  { value: PERMISSION.PREPARE_ORDERS, label: 'Prepare orders' },
  { value: PERMISSION.TAKE_PAYMENT, label: 'Take payments' },
  { value: PERMISSION.VIEW_PUBLIC_MENU, label: 'View public menu' },
];

export const workspaceOptions = [
  { value: 'admin', label: 'Admin workspace' },
  { value: 'cashier', label: 'Cashier workspace' },
  { value: 'waiter', label: 'Waiter workspace' },
  { value: 'chef', label: 'Chef workspace' },
];

function slugify(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function normalize(role) {
  return {
    description: '',
    status: 'active',
    baseRole: role.slug,
    permissions: ROLE_PERMISSIONS[role.slug] ?? [],
    ...role,
  };
}

function audit(action, actor, role, message) {
  database.create('auditLogs', {
    action,
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    entityType: 'role',
    entityId: role.id,
    message,
  }, 'audit');
}

export const roleService = {
  list() {
    return database.list('roles').map(normalize);
  },
  getById(id) {
    const role = database.get('roles', id);
    return role ? normalize(role) : null;
  },
  findByName(name) {
    const normalizedName = name.trim().toLowerCase();
    return this.list().find((role) => role.name.toLowerCase() === normalizedName || role.id === name) ?? null;
  },
  create(values, actor) {
    const name = values.name.trim();
    const slug = slugify(name);
    if (!slug) throw new Error('Enter a valid role name.');
    if (this.list().some((role) => role.name.toLowerCase() === name.toLowerCase() || role.slug === slug)) {
      throw new Error('A role with this name already exists.');
    }
    const role = database.create('roles', {
      name,
      slug,
      description: values.description.trim(),
      baseRole: values.baseRole,
      permissions: [...new Set(values.permissions)],
      status: values.status,
      system: false,
    }, 'role');
    audit('role.create', actor, role, `${actor?.name ?? 'System'} created role ${role.name}`);
    return normalize(role);
  },
  update(id, values, actor) {
    const current = this.getById(id);
    if (!current) throw new Error('Role not found.');
    const name = current.system ? current.name : values.name.trim();
    const slug = current.system ? current.slug : slugify(name);
    if (this.list().some((role) => role.id !== id && (role.name.toLowerCase() === name.toLowerCase() || role.slug === slug))) {
      throw new Error('A role with this name already exists.');
    }
    const role = database.update('roles', id, {
      name,
      slug,
      description: values.description.trim(),
      baseRole: current.system ? current.slug : values.baseRole,
      permissions: [...new Set(values.permissions)],
      status: current.system ? 'active' : values.status,
      system: current.system,
    });
    audit('role.update', actor, role, `${actor?.name ?? 'System'} updated role ${role.name}`);
    return normalize(role);
  },
  remove(id, actor) {
    const role = this.getById(id);
    if (!role) throw new Error('Role not found.');
    if (role.system) throw new Error('System roles cannot be deleted.');
    if (this.getEmployeeCount(role) > 0) throw new Error('Reassign employees before deleting this role.');
    database.remove('roles', id);
    audit('role.delete', actor, role, `${actor?.name ?? 'System'} deleted role ${role.name}`);
    return true;
  },
  getEmployeeCount(role) {
    return database.list('employees').filter((employee) => employee.roleId === role.id || (!employee.roleId && employee.role?.toLowerCase() === role.name.toLowerCase())).length;
  },
  userHasPermission(user, permission) {
    if (!permission) return true;
    const assignedRole = user?.roleId ? this.getById(user.roleId) : this.list().find((role) => role.slug === user?.role);
    return assignedRole?.status === 'active' && assignedRole.permissions.includes(permission);
  },
};
