import { database } from './database';

const SESSION_KEY = 'restaurant-auth-session';

const publicUser = (record) => {
  const user = { ...record };
  delete user.password;
  return user;
};

export const authService = {
  getSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
      if (!session?.id || !session?.role) return null;
      const currentUser = database.get('users', session.id);
      if (!currentUser || currentUser.status !== 'active') {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return publicUser(currentUser);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },
  saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
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
  logout(user) {
    localStorage.removeItem(SESSION_KEY);
    if (!user) return;
    database.create('auditLogs', {
      action: 'auth.logout',
      actorId: user.id,
      actorName: user.name,
      entityType: 'user',
      entityId: user.id,
      message: `${user.name} signed out`,
    }, 'audit');
  },
};
