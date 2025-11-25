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

const JOB_POSTING_BASE_PATH = "/job-postings";

export const getJobPostings = () => {
  return apiInstance.get<ApiResponse<JobPosting[]>>(JOB_POSTING_BASE_PATH);
};
