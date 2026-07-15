export enum UserRole {
  Admin = 'admin',
  Waiter = 'waiter',
  Chef = 'chef',
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
