import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ApiResponse } from "../types";
import {
  Company,
  CompanyPayload,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../services/company";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export const companyKeys = {
  all: ["companies"] as const,
};

export const useCompanies = () => {
  return useQuery<ApiResponse<Company[]>, AxiosError<ApiErrorResponse>>({
    queryKey: companyKeys.all,
    queryFn: async () => {
      const response = await getCompanies();
      return response.data;
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<{ id: string } | null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: async (companyId) => {
      const response = await deleteCompany(companyId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};

interface UpdateCompanyInput {
  companyId: string;
  payload: Partial<CompanyPayload>;
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Company>,
    AxiosError<ApiErrorResponse>,
    UpdateCompanyInput
  >({
    mutationFn: async ({ companyId, payload }) => {
      const response = await updateCompany(companyId, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};
