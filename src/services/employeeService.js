import { database } from './database.js';
import { roleService } from './roleService.js';

const SYSTEM_ADMIN_USER_ID = 'user-admin';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function assertUniqueEmail(email, excludedUserId) {
  const existingUser = database.find('users', (user) => user.email === email && user.id !== excludedUserId);
  if (existingUser) throw new Error('An account with this email already exists.');
}

function audit(action, actor, employee, message) {
  database.create('auditLogs', {
    action,
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    entityType: 'employee',
    entityId: employee.id,
    message,
  }, 'audit');
}

export const employeeService = {
  list() {
    return database.list('employees');
  },
  getById(id) {
    return database.get('employees', id);
  },
  create(values, actor) {
    const email = normalizeEmail(values.email);
    assertUniqueEmail(email);
    const assignedRole = roleService.findByName(values.role);
    if (!assignedRole || assignedRole.status !== 'active') throw new Error('Choose an active role.');
    const user = database.create('users', {
      name: values.name.trim(),
      email,
      password: values.password,
      role: assignedRole.baseRole,
      roleId: assignedRole.id,
      status: values.status,
    }, 'user');
    const employee = database.create('employees', {
      userId: user.id,
      name: values.name.trim(),
      email,
      phone: values.phone.trim(),
      role: assignedRole.name,
      roleId: assignedRole.id,
      status: values.status,
    }, 'employee');
    audit('employee.create', actor, employee, `${actor?.name ?? 'System'} created employee ${employee.name}`);
    return employee;
  },
  update(id, values, actor) {
    const current = database.get('employees', id);
    if (!current) throw new Error('Employee record not found.');
    const isSystemAdmin = current.userId === SYSTEM_ADMIN_USER_ID;
    const email = isSystemAdmin ? current.email : normalizeEmail(values.email);
    const assignedRole = roleService.findByName(isSystemAdmin ? 'Admin' : values.role);
    if (!assignedRole || assignedRole.status !== 'active') throw new Error('Choose an active role.');
    const role = assignedRole.name;
    const status = isSystemAdmin ? 'active' : values.status;
    assertUniqueEmail(email, current.userId);

    const employee = database.update('employees', id, {
      name: values.name.trim(),
      email,
      phone: values.phone.trim(),
      role,
      roleId: assignedRole.id,
      status,
    });
    if (current.userId) {
      database.update('users', current.userId, {
        name: values.name.trim(),
        email,
        role: assignedRole.baseRole,
        roleId: assignedRole.id,
        status,
        ...(values.password ? { password: values.password } : {}),
      });
    }
    audit('employee.update', actor, employee, `${actor?.name ?? 'System'} updated employee ${employee.name}`);
    return employee;
  },
  remove(id, actor) {
    const employee = database.get('employees', id);
    if (!employee) throw new Error('Employee record not found.');
    if (employee.userId === SYSTEM_ADMIN_USER_ID) throw new Error('The required administrator account cannot be deleted.');
    if (employee.userId === actor?.id) throw new Error('You cannot delete your own active account.');
    database.remove('employees', id);
    if (employee.userId) database.remove('users', employee.userId);
    audit('employee.delete', actor, employee, `${actor?.name ?? 'System'} deleted employee ${employee.name}`);
    return true;
  },
  isProtected(employee, actor) {
    return employee.userId === SYSTEM_ADMIN_USER_ID || employee.userId === actor?.id;
  },
};
