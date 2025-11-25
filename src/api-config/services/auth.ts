import apiInstance from "../instance";
import { ApiResponse } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  message?: string;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function googleLogin() {
  return apiInstance.get("/auth/google");
}

export async function login(payload: LoginPayload) {
  return apiInstance.post<ApiResponse<AuthTokens>>("/auth/login", payload);
}

export async function logout() {
  console.log("logout function called");
  return apiInstance.post("/auth/logout-google");
}
