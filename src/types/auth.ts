export enum UserRole {
  Admin = 'admin',
  Cashier = 'cashier',
  Waiter = 'waiter',
  Chef = 'chef',
  Consumer = 'consumer',
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'inactive';
  avatarUrl?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
