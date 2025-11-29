import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookieStore, removeCookieStore } from "@/helper/store";
import { logout } from "../services/auth";

// Global logout callback to communicate with AuthContext
let globalLogoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
const USER_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string;
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string;
const AUTH_HEADER = "Authorization";
const BEARER_PREFIX = "Bearer ";

let apiInstance: AxiosInstance | null = null;

const setAuthToken = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const token = await getCookieStore(USER_TOKEN_KEY);

  if (config.headers) {
    if (token) {
      config.headers[AUTH_HEADER] = `${BEARER_PREFIX}${token}`;
    }
  }

  return config;
};

const refreshAccessToken = async (): Promise<{
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
  timestamp: string;
} | null> => {
  const refreshToken = await getCookieStore(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    return null;
  }

  try {
    const response: AxiosResponse<{
      statusCode: number;
      message: string;
      data: {
        message: string;
      };
      timestamp: string;
    }> = await axios.post(
      `${BASE_URL}/user/refresh-token-google`,
      { refreshToken },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

// Function to handle unauthorized response and retry request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleUnauthorizedError = async (error: any) => {
  const originalRequest = error.config;

  // Check if error is due to unauthorized access (401) and retry is not set
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const result = await refreshAccessToken();
    console.log("result", result);
    if (!result || result.statusCode !== 201 || result === null) {
      console.log("Token refresh failed, logging out");
      await logout();
      removeCookieStore(USER_TOKEN_KEY);
      removeCookieStore(REFRESH_TOKEN_KEY);

      // Call the global logout callback to update AuthContext
      if (globalLogoutCallback) {
        globalLogoutCallback();
      }

      console.log("logout completed");
      // window.location.href = "/login";
      return;
    }
    const newAccessToken = await getCookieStore(USER_TOKEN_KEY);
    originalRequest.headers[AUTH_HEADER] = `${BEARER_PREFIX}${newAccessToken}`;
    return apiInstance!(originalRequest); // Retry the original request with the new access token
  }

  return Promise.reject(error);
};

const initializeApiInstance = (): AxiosInstance => {
  if (apiInstance) {
    return apiInstance;
  }

  apiInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 180000, // 3 mins
    withCredentials: true,
  });

  apiInstance.interceptors.request.use(
    async (config) => {
      const updatedConfig = await setAuthToken(config);
      return updatedConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    handleUnauthorizedError
  );

  return apiInstance;
};

export default initializeApiInstance();
