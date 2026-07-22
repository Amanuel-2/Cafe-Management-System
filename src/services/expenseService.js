import { database } from './database.js';

export const EXPENSE_CATEGORIES = ['Food supplies', 'Utilities', 'Payroll', 'Rent', 'Maintenance', 'Marketing', 'Other'];
function audit(action, actor, expense, message) { database.create('auditLogs', { action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'expense', entityId: expense.id, message }, 'audit'); }
function validate(values) { if (values.description.trim().length < 3) throw new Error('Description must contain at least 3 characters.'); if (!EXPENSE_CATEGORIES.includes(values.category)) throw new Error('Choose a valid expense category.'); if (!Number.isFinite(values.amount) || values.amount <= 0) throw new Error('Amount must be greater than zero.'); if (!values.date) throw new Error('Expense date is required.'); }

export const expenseService = {
  list() { return database.list('expenses').sort((a, b) => b.date.localeCompare(a.date)); }, getById(id) { return database.get('expenses', id); },
  create(values, actor) { validate(values); const expense = database.create('expenses', { ...values, description: values.description.trim() }, 'expense'); audit('expense.create', actor, expense, `${actor?.name ?? 'System'} recorded ${expense.description}`); return expense; },
  update(id, values, actor) { if (!this.getById(id)) throw new Error('Expense not found.'); validate(values); const expense = database.update('expenses', id, { ...values, description: values.description.trim() }); audit('expense.update', actor, expense, `${actor?.name ?? 'System'} updated expense ${expense.description}`); return expense; },
  remove(id, actor) { const expense = this.getById(id); if (!expense) throw new Error('Expense not found.'); database.remove('expenses', id); audit('expense.delete', actor, expense, `${actor?.name ?? 'System'} deleted expense ${expense.description}`); return true; },
};
