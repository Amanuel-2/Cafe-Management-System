import { database } from './database.js';

export const auditService = {
  list() {
    return database.list('auditLogs').sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  },
};

