import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "../types";
import {
  JobPosting,
  JobPostingPayload,
  deleteJobPosting,
  getJobPostings,
  updateJobPosting,
} from "../services/job-postings";
import { ApiErrorResponse, getApiErrorMessage } from "@/lib/api-error";

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
      toast.success("Job posting deleted successfully.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete job posting."));
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
      toast.success("Job status updated.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update job status."));
    },
  });
};
