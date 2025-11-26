import apiInstance from "../instance";
import { ApiResponse } from "../types";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  role: string;
  loginCount: number;
  companyId: string | null;
  resumeUrl: string | null;
  birthDate: string | null;
  nrc: string | null;
  status: string;
  google_id: string | null;
  google_email: string | null;
  avatar_url: string | null;
  provider: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListResponse {
  data: User[];
  pagination: PaginationMeta;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export type UserStatusValue = "ACTIVE" | "DELETE";

export interface UpdateUserStatusPayload {
  status: UserStatusValue;
}

const USER_BASE_PATH = "/user";

export const getUsers = (params: UserQueryParams) => {
  return apiInstance.get<ApiResponse<UserListResponse>>(USER_BASE_PATH, {
    params,
  });
};

export const updateUserStatus = (userId: string, payload: UpdateUserStatusPayload) => {
  return apiInstance.patch<ApiResponse<User>>(
    `${USER_BASE_PATH}/${userId}/status`,
    payload
  );
};
