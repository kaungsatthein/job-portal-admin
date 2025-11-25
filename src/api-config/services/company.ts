import apiInstance from "../instance";
import { ApiResponse } from "../types";
import { JobPosting } from "./job-postings";

export interface CompanyIndustry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRecruiter {
  id: string;
  email: string;
  name: string;
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  name: string;
  industryId: string;
  status: "open" | "close" | "pending" | string;
  createdAt: string;
  updatedAt: string;
  industry?: CompanyIndustry | null;
  recruiters?: CompanyRecruiter[];
  jobPostings?: JobPosting[];
}

export interface CompanyPayload {
  name: string;
  industryId: string;
  status: "open" | "close" | "pending" | string;
}

const COMPANY_BASE_PATH = "/company";

export const getCompanies = () => {
  return apiInstance.get<ApiResponse<Company[]>>(COMPANY_BASE_PATH);
};

export const deleteCompany = (companyId: string) => {
  return apiInstance.delete<ApiResponse<{ id: string } | null>>(
    `${COMPANY_BASE_PATH}/${companyId}`
  );
};

export const updateCompany = (
  companyId: string,
  payload: Partial<CompanyPayload>
) => {
  return apiInstance.patch<ApiResponse<Company>>(
    `${COMPANY_BASE_PATH}/${companyId}`,
    payload
  );
};
