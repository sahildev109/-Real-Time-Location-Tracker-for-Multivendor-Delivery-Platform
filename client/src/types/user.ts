export type Role = 'vendor' | 'delivery' | 'customer';

export interface User {
  email: string;
  password: string;
  role: Role;
}
