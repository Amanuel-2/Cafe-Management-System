import { database } from './database';

export const recipeService = {
  list() {
    return database.list('recipes');
  },
  getById(id) {
    return database.get('recipes', id);
  },
  create(values) {
    return database.create('recipes', values, 'recipe');
  },
  update(id, values) {
    return database.update('recipes', id, values);
  },
  remove(id) {
    return database.remove('recipes', id);
  },
};

