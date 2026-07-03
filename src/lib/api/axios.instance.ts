import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import { env } from "@/config/env.config";
import { tokenManager } from "@/lib/auth/token.manager";
import { parseApiError } from "@/utils/error.utils";

const httpClient: AxiosInstance = axios.create({
  baseURL: env.api.baseUrl,
  timeout: env.api.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (env.app.isDevelopment) {
      console.log(`[API ▶] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (env.app.isDevelopment) {
      console.log(`[API ✓] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenManager.clearAll();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const errorMessage = parseApiError(error);
    return Promise.reject(new Error(errorMessage));
  }
);

export default httpClient;