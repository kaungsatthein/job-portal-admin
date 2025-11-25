import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { logout, googleLogin, login } from "../services/auth";
import type { AuthTokens, LoginPayload } from "../services/auth";
import { removeCookieStore } from "@/helper/store";
import { USER_PROFILE_STORAGE_KEY } from "@/lib/constants";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (response) => {
      // Handle successful Google login
      if (response.data?.accessToken) {
        // Store the access token
        document.cookie = `${process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN}=${response.data.accessToken}; path=/; max-age=3600`;
        // Redirect to home or refresh the page
        window.location.href = "/";
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export function useLogin() {
  return useMutation<AxiosResponse<AuthTokens>, AxiosError<ApiErrorResponse>, LoginPayload>({
    mutationFn: login,
    onSuccess: (response) => {
      // Handle successful login
      if (response.data?.accessToken) {
        // Store the access token
        document.cookie = `${process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN}=${response.data.accessToken}; path=/; max-age=3600`;
        // Redirect to home or refresh the page
        window.location.href = "/";
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeCookieStore(process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string);
      removeCookieStore(process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string);
      if (typeof window !== "undefined") {
        localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      }
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
    },
  });
};
