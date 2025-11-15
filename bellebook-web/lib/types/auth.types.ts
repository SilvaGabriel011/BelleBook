export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  displayName: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  avatar: string | null;
  timezone: string | null;
  phone: string | null;
  birthDate: string | null;
  points: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  specialties: string[];
  bio: string | null;
  workSchedule: Record<string, any>;
  rating: number;
  totalServices: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  permissions: string[];
  department: string | null;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequest {
  id: string;
  userId: string;
  requestedRole: UserRole;
  currentRole: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestReason: string;
  adminNotes: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'email' | 'name' | 'displayName' | 'avatar'>;
  approvedBy?: Pick<User, 'id' | 'email' | 'name' | 'displayName'>;
}

export interface CreateRoleRequestDto {
  requestedRole: UserRole;
  reason: string;
}

export interface ApproveRoleRequestDto {
  notes?: string;
}

export interface RejectRoleRequestDto {
  reason: string;
}
