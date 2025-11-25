import apiInstance from "../instance";
import { ApiResponse } from "../types";

export interface JobPostingCompany {
  id: string;
  name: string;
}

export interface JobPosting {
  id: string;
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  jobType: "fulltime" | "parttime" | "contract" | "internship" | string;
  location: string;
  salaryRange: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company?: JobPostingCompany | null;
}

export interface JobPostingPayload {
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  jobType: "fulltime" | "parttime" | "contract" | "internship" | string;
  location: string;
  salaryRange: string;
  status: "open" | "close" | "pending" | string;
}

const JOB_POSTING_BASE_PATH = "/job-postings";

export const getJobPostings = () => {
  return apiInstance.get<ApiResponse<JobPosting[]>>(JOB_POSTING_BASE_PATH);
};

export const deleteJobPosting = (jobPostingId: string) => {
  return apiInstance.delete<ApiResponse<{ id: string } | null>>(
    `${JOB_POSTING_BASE_PATH}/${jobPostingId}`
  );
};

export const updateJobPosting = (
  jobPostingId: string,
  payload: Partial<JobPostingPayload>
) => {
  return apiInstance.patch<ApiResponse<JobPosting>>(
    `${JOB_POSTING_BASE_PATH}/${jobPostingId}`,
    payload
  );
};
