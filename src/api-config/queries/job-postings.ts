import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ApiResponse } from "../types";
import {
  JobPosting,
  JobPostingPayload,
  deleteJobPosting,
  getJobPostings,
  updateJobPosting,
} from "../services/job-postings";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export const jobPostingKeys = {
  all: ["job-postings"] as const,
};

export const useJobPostings = () => {
  return useQuery<ApiResponse<JobPosting[]>, AxiosError<ApiErrorResponse>>({
    queryKey: jobPostingKeys.all,
    queryFn: async () => {
      const response = await getJobPostings();
      return response.data;
    },
  });
};

export const useDeleteJobPosting = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<{ id: string } | null>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: async (jobPostingId) => {
      const response = await deleteJobPosting(jobPostingId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPostingKeys.all });
    },
  });
};

interface UpdateJobPostingInput {
  jobPostingId: string;
  payload: Partial<JobPostingPayload>;
}

export const useUpdateJobPosting = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<JobPosting>,
    AxiosError<ApiErrorResponse>,
    UpdateJobPostingInput
  >({
    mutationFn: async ({ jobPostingId, payload }) => {
      const response = await updateJobPosting(jobPostingId, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPostingKeys.all });
    },
  });
};
