import api from '@/lib/api';
import {
  RoleRequest,
  CreateRoleRequestDto,
  ApproveRoleRequestDto,
  RejectRoleRequestDto,
  RoleRequestListResponse,
} from '@/types/role-request.types';

export const roleRequestService = {
  /**
   * Create a new role request
   */
  async createRoleRequest(data: CreateRoleRequestDto): Promise<RoleRequest> {
    const { data: response } = await api.post<RoleRequest>('/role-requests', data);
    return response;
  },

  /**
   * Get the current user's active role request
   */
  async getMyRoleRequest(): Promise<RoleRequest | null> {
    try {
      const { data } = await api.get<RoleRequest>('/role-requests/my-request');
      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  /**
   * Get all role requests (admin only)
   */
  async getAllRoleRequests(params?: {
    status?: string;
    role?: string;
  }): Promise<RoleRequestListResponse> {
    const { data } = await api.get<RoleRequestListResponse>('/role-requests', { params });
    return data;
  },

  /**
   * Get a specific role request by ID
   */
  async getRoleRequestById(id: string): Promise<RoleRequest> {
    const { data } = await api.get<RoleRequest>(`/role-requests/${id}`);
    return data;
  },

  /**
   * Approve a role request (admin only)
   */
  async approveRoleRequest(
    id: string,
    approvalData?: ApproveRoleRequestDto
  ): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(
      `/role-requests/${id}/approve`,
      approvalData || {}
    );
    return data;
  },

  /**
   * Reject a role request (admin only)
   */
  async rejectRoleRequest(
    id: string,
    rejectionData: RejectRoleRequestDto
  ): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(
      `/role-requests/${id}/reject`,
      rejectionData
    );
    return data;
  },
};
