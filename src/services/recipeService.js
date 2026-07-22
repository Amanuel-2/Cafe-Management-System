import { database } from './database.js';

function audit(action, actor, recipe, message) {
  database.create('auditLogs', {
    action,
    actorId: actor?.id ?? 'system',
    actorName: actor?.name ?? 'System',
    entityType: 'recipe',
    entityId: recipe.id,
    message,
  }, 'audit');
}

function validate(values, currentId) {
  if (values.name.trim().length < 2) throw new Error('Recipe name must contain at least 2 characters.');
  if (!database.get('menuItems', values.menuItemId)) throw new Error('Choose a valid menu item.');
  if (database.list('recipes').some((recipe) => recipe.id !== currentId && recipe.menuItemId === values.menuItemId)) {
    throw new Error('This menu item already has a recipe.');
  }
  if (!values.ingredients?.length) throw new Error('Add at least one ingredient.');
  const ids = values.ingredients.map((ingredient) => ingredient.inventoryItemId);
  if (new Set(ids).size !== ids.length) throw new Error('Each inventory ingredient can only be added once.');
  values.ingredients.forEach((ingredient) => {
    if (!database.get('inventoryItems', ingredient.inventoryItemId)) throw new Error('Choose a valid inventory ingredient.');
    if (!Number.isFinite(ingredient.quantity) || ingredient.quantity <= 0) throw new Error('Ingredient quantities must be greater than zero.');
  });
}

export const recipeService = {
  list() {
    return database.list('recipes');
  },
  getById(id) {
    return database.get('recipes', id);
  },
  create(values, actor) {
    validate(values);
    const recipe = database.create('recipes', { ...values, name: values.name.trim() }, 'recipe');
    audit('recipe.create', actor, recipe, `${actor?.name ?? 'System'} created recipe ${recipe.name}`);
    return recipe;
  },
  update(id, values, actor) {
    if (!this.getById(id)) throw new Error('Recipe not found.');
    validate(values, id);
    const recipe = database.update('recipes', id, { ...values, name: values.name.trim() });
    audit('recipe.update', actor, recipe, `${actor?.name ?? 'System'} updated recipe ${recipe.name}`);
    return recipe;
  },
  remove(id, actor) {
    const recipe = this.getById(id);
    if (!recipe) throw new Error('Recipe not found.');
    database.remove('recipes', id);
    audit('recipe.delete', actor, recipe, `${actor?.name ?? 'System'} deleted recipe ${recipe.name}`);
    return true;
  },
};
