import { UserRole } from '../types/auth';

export const roleHomePath: Record<UserRole, string> = {
  [UserRole.Admin]: '/admin',
  [UserRole.Waiter]: '/waiter',
  [UserRole.Chef]: '/chef',
};
