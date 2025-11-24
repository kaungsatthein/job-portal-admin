import apiInstance from "../instance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  [key: string]: unknown;
}

export async function googleLogin() {
  return apiInstance.get("/auth/google");
}

export async function login(payload: LoginPayload) {
  return apiInstance.post<AuthTokens>("/auth/login", payload);
}

export async function logout() {
  console.log("logout function called");
  return apiInstance.post("/auth/logout-google");
}
