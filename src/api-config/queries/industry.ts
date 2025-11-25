import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Industry,
  IndustryPayload,
  createIndustry,
  deleteIndustry,
  getIndustries,
  updateIndustry,
} from "../services/industry";
import { ApiResponse } from "../types";
import { ApiErrorResponse, getApiErrorMessage } from "@/lib/api-error";

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
      toast.success("Industry created successfully.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create industry."));
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
      toast.success("Industry updated successfully.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update industry."));
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
      toast.success("Industry deleted successfully.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete industry."));
    },
  });
};
