export type UserRole = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  phone?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  points: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  displayName?: string;
  phone: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
