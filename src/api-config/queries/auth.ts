import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { logout, googleLogin, login } from "../services/auth";
import type { AuthTokens, LoginPayload } from "../services/auth";
import { removeCookieStore } from "@/helper/store";
import { USER_PROFILE_STORAGE_KEY } from "@/lib/constants";
import { ApiResponse } from "../types";

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

const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN;
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN;
const isProduction = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const setBrowserCookie = (key: string | undefined, value?: string, maxAge?: number) => {
  if (!key || !value || typeof document === "undefined") {
    return;
  }

  const encodedValue = encodeURIComponent(value);
  const secureAttribute = isProduction ? "; Secure" : "";
  const cookieMaxAge = typeof maxAge === "number" ? maxAge : ACCESS_TOKEN_MAX_AGE;

  document.cookie = `${key}=${encodedValue}; path=/; max-age=${cookieMaxAge}; SameSite=Lax${secureAttribute}`;
};

export function useLogin() {
  return useMutation<
    AxiosResponse<ApiResponse<AuthTokens>>,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationFn: login,
    onSuccess: (response) => {
      const tokens = response.data?.data?.tokens;
      if (!tokens) return;

      setBrowserCookie(ACCESS_TOKEN_KEY, tokens.accessToken, ACCESS_TOKEN_MAX_AGE);
      setBrowserCookie(REFRESH_TOKEN_KEY, tokens.refreshToken, REFRESH_TOKEN_MAX_AGE);

      if (typeof window !== "undefined") {
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
