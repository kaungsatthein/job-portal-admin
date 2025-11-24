import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  ApiResponse,
  Industry,
  IndustryPayload,
  createIndustry,
  deleteIndustry,
  getIndustries,
  updateIndustry,
} from "../services/industry";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export const industryKeys = {
  all: ["industries"] as const,
  detail: (industryId: string) => ["industries", industryId] as const,
};

export const useIndustries = () => {
  return useQuery<ApiResponse<Industry[]>, AxiosError<ApiErrorResponse>>({
    queryKey: industryKeys.all,
    queryFn: async () => {
      const response = await getIndustries();
      return response.data;
    },
  });
};

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Industry>,
    AxiosError<ApiErrorResponse>,
    IndustryPayload
  >({
    mutationFn: async (payload) => {
      const response = await createIndustry(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all });
    },
  });
};

interface UpdateIndustryInput {
  industryId: string;
  payload: IndustryPayload;
}

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Industry>,
    AxiosError<ApiErrorResponse>,
    UpdateIndustryInput
  >({
    mutationFn: async ({ industryId, payload }) => {
      const response = await updateIndustry(industryId, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all });
      queryClient.invalidateQueries({ queryKey: industryKeys.detail(variables.industryId) });
    },
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<{ id: string } | null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: async (industryId) => {
      const response = await deleteIndustry(industryId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all });
    },
  });
};
