import { database } from './database';

const publicUser = (record) => {
  const user = { ...record };
  delete user.password;
  return user;
};

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = database.find('users', (record) => record.email.toLowerCase() === normalizedEmail);

    if (!user || user.password !== password) {
      throw new Error('The email or password is incorrect.');
    }

    if (user.status !== 'active') {
      throw new Error('This account is inactive. Contact an administrator.');
    }

    database.create('auditLogs', {
      action: 'auth.login',
      actorId: user.id,
      actorName: user.name,
      entityType: 'user',
      entityId: user.id,
      message: `${user.name} signed in`,
    }, 'audit');

    return publicUser(user);
  },
};
