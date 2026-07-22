import { database } from './database.js';

function audit(action, actor, item, message) {
  database.create('auditLogs', { action, actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'inventoryItem', entityId: item.id, message }, 'audit');
}

function validate(values, currentId) {
  const name = values.name.trim();
  if (name.length < 2) throw new Error('Ingredient name must contain at least 2 characters.');
  if (database.list('inventoryItems').some((item) => item.id !== currentId && item.name.toLowerCase() === name.toLowerCase())) throw new Error('An inventory item with this name already exists.');
  if (!values.unit?.trim()) throw new Error('Unit is required.');
  if (![values.stock, values.minimumStock, values.cost].every((value) => Number.isFinite(value) && value >= 0)) throw new Error('Stock, minimum stock, and cost cannot be negative.');
  if (values.supplierId && !database.get('suppliers', values.supplierId)) throw new Error('Choose a valid supplier.');
}

export const inventoryService = {
  list() {
    return database.list('inventoryItems');
  },
  getById(id) {
    return database.get('inventoryItems', id);
  },
  create(values, actor) {
    validate(values);
    return database.transaction((state) => {
      const timestamp = new Date().toISOString();
      const item = { ...values, id: database.createId('inventory'), name: values.name.trim(), unit: values.unit.trim(), minimumStock: values.minimumStock, parLevel: values.minimumStock, createdAt: timestamp, updatedAt: timestamp };
      state.inventoryItems.push(item);
      state.stockMovements.push({ id: database.createId('movement'), inventoryItemId: item.id, type: 'opening_balance', quantity: item.stock, reason: 'Opening stock balance', actorId: actor?.id ?? 'system', createdAt: timestamp });
      state.auditLogs.push({ id: database.createId('audit'), action: 'inventory.create', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'inventoryItem', entityId: item.id, message: `${actor?.name ?? 'System'} created inventory item ${item.name}`, createdAt: timestamp, updatedAt: timestamp });
      return item;
    }, 'inventoryItems,stockMovements,auditLogs');
  },
  update(id, values, actor) {
    if (!this.getById(id)) throw new Error('Inventory item not found.');
    validate(values, id);
    return database.transaction((state) => {
      const item = state.inventoryItems.find((entry) => entry.id === id);
      const timestamp = new Date().toISOString();
      const difference = values.stock - item.stock;
      Object.assign(item, values, { id, name: values.name.trim(), unit: values.unit.trim(), minimumStock: values.minimumStock, parLevel: values.minimumStock, updatedAt: timestamp });
      if (difference !== 0) state.stockMovements.push({ id: database.createId('movement'), inventoryItemId: id, type: 'adjustment', quantity: difference, reason: 'Inventory record update', actorId: actor?.id ?? 'system', createdAt: timestamp });
      state.auditLogs.push({ id: database.createId('audit'), action: 'inventory.update', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'inventoryItem', entityId: id, message: `${actor?.name ?? 'System'} updated inventory item ${item.name}`, createdAt: timestamp, updatedAt: timestamp });
      return item;
    }, 'inventoryItems,stockMovements,auditLogs');
  },
  adjustStock(id, quantity, reason, actor) {
    if (!Number.isFinite(quantity) || quantity === 0) throw new Error('Adjustment quantity cannot be zero.');
    return database.transaction((state) => {
      const item = state.inventoryItems.find((entry) => entry.id === id);
      if (!item) throw new Error('Inventory item not found.');
      if (item.stock + quantity < 0) throw new Error('This adjustment would make stock negative.');
      item.stock += quantity;
      item.updatedAt = new Date().toISOString();
      const movement = { id: database.createId('movement'), inventoryItemId: id, type: 'adjustment', quantity, reason: reason.trim() || 'Manual adjustment', actorId: actor?.id ?? 'system', createdAt: new Date().toISOString() };
      state.stockMovements.push(movement);
      state.auditLogs.push({ id: database.createId('audit'), action: 'inventory.adjust', actorId: actor?.id ?? 'system', actorName: actor?.name ?? 'System', entityType: 'inventoryItem', entityId: id, message: `${actor?.name ?? 'System'} adjusted ${item.name} by ${quantity} ${item.unit}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      return { item, movement };
    }, 'inventoryItems,stockMovements,auditLogs');
  },
  remove(id, actor) {
    const item = this.getById(id);
    if (!item) throw new Error('Inventory item not found.');
    if (database.list('recipes').some((recipe) => recipe.ingredients.some((ingredient) => ingredient.inventoryItemId === id))) throw new Error('Remove this ingredient from all recipes before deleting it.');
    if (database.list('purchaseOrders').some((order) => order.items?.some((line) => line.inventoryItemId === id))) throw new Error('This ingredient is referenced by purchase history and cannot be deleted.');
    database.remove('inventoryItems', id);
    audit('inventory.delete', actor, item, `${actor?.name ?? 'System'} deleted inventory item ${item.name}`);
    return true;
  },
  getLowStock() {
    return this.list().filter((item) => item.stock <= (item.minimumStock ?? item.parLevel));
  },
  listMovements(inventoryItemId) {
    return database.list('stockMovements').filter((movement) => !inventoryItemId || movement.inventoryItemId === inventoryItemId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
