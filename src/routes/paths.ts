import { UserRole } from '../types/auth';

export const roleHomePath: Record<UserRole, string> = {
  [UserRole.Admin]: '/admin',
  [UserRole.Cashier]: '/cashier',
  [UserRole.Waiter]: '/waiter',
  [UserRole.Chef]: '/chef',
  [UserRole.Consumer]: '/menu',
};
