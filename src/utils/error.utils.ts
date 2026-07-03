import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";

export const parseApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }
    if (axiosError.request) {
      return "Network error. Please check your internet connection.";
    }
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
};

export const isAxiosError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as { isAxiosError: boolean }).isAxiosError === true
  );
};