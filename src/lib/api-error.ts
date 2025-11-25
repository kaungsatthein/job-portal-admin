import type { AxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export const getApiErrorMessage = (
  error: AxiosError<ApiErrorResponse> | null | undefined,
  fallbackMessage = "Something went wrong."
) => {
  if (!error) {
    return fallbackMessage;
  }

  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallbackMessage
  );
};
