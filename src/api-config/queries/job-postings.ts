import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ApiResponse } from "../types";
import { JobPosting, getJobPostings } from "../services/job-postings";

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
