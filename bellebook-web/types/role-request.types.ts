import { UserRole } from './auth.types';

export type RoleRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RoleRequest {
  id: string;
  userId: string;
  requestedRole: UserRole;
  currentRole: UserRole;
  status: RoleRequestStatus;
  requestReason: string;
  experience?: string;
  certifications?: string;
  motivation?: string;
  department?: string;
  adminNotes?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    displayName?: string;
    createdAt: string;
  };
}

export interface CreateRoleRequestDto {
  requestedRole: Exclude<UserRole, 'CUSTOMER'>;
  reason: string;
  // Employee specific fields
  experience?: string;
  certifications?: string;
  motivation?: string;
  // Admin specific field
  department?: string;
}

export interface ApproveRoleRequestDto {
  notes?: string;
}

export interface RejectRoleRequestDto {
  reason: string;
}

export interface RoleRequestListResponse {
  requests: RoleRequest[];
  total: number;
}
