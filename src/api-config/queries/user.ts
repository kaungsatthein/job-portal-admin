import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "../types";
import {
  UserListResponse,
  UserQueryParams,
  getUsers,
  updateUserStatus,
  UserStatusValue,
  User,
} from "../services/user";
import { ApiErrorResponse, getApiErrorMessage } from "@/lib/api-error";

export const userKeys = {
  all: ["users"] as const,
  list: (params: UserQueryParams) => ["users", params] as const,
};

export const useUsers = (params: UserQueryParams) => {
  return useQuery<
    ApiResponse<UserListResponse>,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await getUsers(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

interface UpdateUserStatusInput {
  userId: string;
  status: UserStatusValue;
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<User>,
    AxiosError<ApiErrorResponse>,
    UpdateUserStatusInput
  >({
    mutationFn: async ({ userId, status }) => {
      const response = await updateUserStatus(userId, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      const message =
        variables.status === "DELETE"
          ? "User marked as deleted."
          : "User activated.";
      toast.success(message);
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Failed to update user status.")
      );
    },
  });
};
