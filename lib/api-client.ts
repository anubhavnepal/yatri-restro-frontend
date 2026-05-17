import { ApiError } from "@/lib/api-error";
import { getPublicEnv } from "@/lib/env";
import type { ApiRequestConfig, ApiResponse } from "@/types/api.types";

export type ApiClient = {
  request<TData, TBody = unknown>(
    config: ApiRequestConfig<TBody>,
  ): Promise<ApiResponse<TData>>;
  get<TData>(
    path: string,
    config?: Omit<ApiRequestConfig<never>, "method" | "path" | "body">,
  ): Promise<ApiResponse<TData>>;
  post<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ): Promise<ApiResponse<TData>>;
  patch<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ): Promise<ApiResponse<TData>>;
};

const missingTransportMessage =
  "API client transport is not wired yet. Install and integrate Axios in the next setup step.";

async function notImplemented<TData>(): Promise<ApiResponse<TData>> {
  throw new ApiError({
    message: missingTransportMessage,
    statusCode: 500,
  });
}

export function getApiBaseUrl(): string {
  const { NEXT_PUBLIC_API_URL } = getPublicEnv();

  if (!NEXT_PUBLIC_API_URL) {
    throw new ApiError({
      message: "NEXT_PUBLIC_API_URL is not configured.",
      statusCode: 500,
    });
  }

  return NEXT_PUBLIC_API_URL;
}

export const apiClient: ApiClient = {
  async request<TData, TBody = unknown>(config: ApiRequestConfig<TBody>) {
    void config;
    return notImplemented<TData>();
  },
  async get<TData>(
    path: string,
    config?: Omit<ApiRequestConfig<never>, "method" | "path" | "body">,
  ) {
    void path;
    void config;
    return notImplemented<TData>();
  },
  async post<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ) {
    void path;
    void body;
    void config;
    return notImplemented<TData>();
  },
  async patch<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ) {
    void path;
    void body;
    void config;
    return notImplemented<TData>();
  },
};
