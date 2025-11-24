import apiInstance from "../instance";

export interface IndustryCompany {
  id: string;
  name: string;
  industryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Industry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  companies: IndustryCompany[];
}

export interface IndustryPayload {
  name: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

const INDUSTRY_BASE_PATH = "/industry";

export const getIndustries = () => {
  return apiInstance.get<ApiResponse<Industry[]>>(INDUSTRY_BASE_PATH);
};

export const createIndustry = (payload: IndustryPayload) => {
  return apiInstance.post<ApiResponse<Industry>>(INDUSTRY_BASE_PATH, payload);
};

export const updateIndustry = (industryId: string, payload: IndustryPayload) => {
  return apiInstance.patch<ApiResponse<Industry>>(
    `${INDUSTRY_BASE_PATH}/${industryId}`,
    payload
  );
};

export const deleteIndustry = (industryId: string) => {
  return apiInstance.delete<ApiResponse<{ id: string } | null>>(
    `${INDUSTRY_BASE_PATH}/${industryId}`
  );
};
