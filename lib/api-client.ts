import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { ApiError } from "@/lib/api-error";
import { getPublicEnv } from "@/lib/env";
import type {
  ApiErrorPayload,
  ApiQueryParamPrimitive,
  ApiQueryParams,
  ApiRequestConfig,
  ApiResponse,
} from "@/types/api.types";

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

let axiosClient: AxiosInstance | null = null;

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

function normalizeApiBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function appendQueryValue(
  searchParams: URLSearchParams,
  key: string,
  value: ApiQueryParamPrimitive,
): void {
  searchParams.append(key, String(value));
}

export function serializeQueryParams(query?: ApiQueryParams): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        appendQueryValue(searchParams, key, item);
      }

      continue;
    }

    appendQueryValue(searchParams, key, rawValue);
  }

  return searchParams.toString();
}

function getAxiosClient(): AxiosInstance {
  if (axiosClient) {
    return axiosClient;
  }

  axiosClient = axios.create({
    baseURL: normalizeApiBaseUrl(getApiBaseUrl()),
    headers: {
      Accept: "application/json",
    },
    paramsSerializer: {
      serialize: serializeQueryParams,
    },
    withCredentials: false,
  });

  return axiosClient;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeValidationErrors(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map((issue) => {
      if (!isRecord(issue)) {
        return null;
      }

      const field = typeof issue.field === "string" ? issue.field : "";
      const message = typeof issue.message === "string" ? issue.message : "";

      if (!field || !message) {
        return null;
      }

      return {
        field,
        message,
        code: typeof issue.code === "string" ? issue.code : undefined,
      };
    })
    .filter((issue) => issue !== null);

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeFailurePayload(
  payload: Record<string, unknown>,
  fallbackStatusCode?: number,
): ApiErrorPayload {
  return {
    success: false,
    message:
      typeof payload.message === "string"
        ? payload.message
        : "The request could not be completed.",
    data: null,
    errors: normalizeValidationErrors(payload.errors),
    statusCode:
      typeof payload.statusCode === "number"
        ? payload.statusCode
        : fallbackStatusCode,
    code: typeof payload.code === "string" ? payload.code : undefined,
  };
}

function normalizeApiResponse<TData>(
  payload: unknown,
  response: Pick<AxiosResponse, "status">,
): ApiResponse<TData> {
  if (!isRecord(payload) || typeof payload.success !== "boolean") {
    throw new ApiError({
      message: "API response shape is invalid.",
      statusCode: response.status,
      details: payload,
      code: "API_RESPONSE_INVALID",
    });
  }

  if (typeof payload.message !== "string" || !("data" in payload)) {
    throw new ApiError({
      message: "API response is missing required fields.",
      statusCode: response.status,
      details: payload,
      code: "API_RESPONSE_INCOMPLETE",
    });
  }

  if (payload.success === false) {
    return normalizeFailurePayload(payload, response.status);
  }

  return {
    success: true,
    message: payload.message,
    data: payload.data as TData,
  };
}

function normalizeAxiosFailure(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) {
    return new ApiError({
      message: "An unknown API error occurred.",
      details: error,
      code: "API_REQUEST_FAILED",
    });
  }

  if (!error.response) {
    const isTimeout = error.code === "ECONNABORTED";

    return new ApiError({
      message: isTimeout
        ? "The request timed out before the server responded."
        : "The server could not be reached.",
      details: error.toJSON(),
      code: error.code,
      isNetworkError: !isTimeout,
      isTimeout,
    });
  }

  const payload = isRecord(error.response.data)
    ? normalizeFailurePayload(error.response.data, error.response.status)
    : null;

  return new ApiError({
    message:
      payload?.message ??
      `The request failed with status ${error.response.status}.`,
    statusCode: error.response.status,
    details: error.response.data,
    code: payload?.code ?? error.code,
    errors: payload?.errors,
    response: payload,
  });
}

function buildRequestHeaders<TBody>(
  config: ApiRequestConfig<TBody>,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...config.headers,
  };

  if (config.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (config.requestedAt) {
    headers["X-Client-Requested-At"] = config.requestedAt;
  }

  return headers;
}

export const apiClient: ApiClient = {
  async request<TData, TBody = unknown>(config: ApiRequestConfig<TBody>) {
    try {
      const response = await getAxiosClient().request<unknown>({
        method: config.method,
        url: config.path,
        data: config.body,
        params: config.query,
        headers: buildRequestHeaders(config),
        signal: config.signal,
        timeout: config.timeoutMs,
      });

      return normalizeApiResponse<TData>(response.data, response);
    } catch (error) {
      throw normalizeAxiosFailure(error);
    }
  },
  async get<TData>(
    path: string,
    config?: Omit<ApiRequestConfig<never>, "method" | "path" | "body">,
  ) {
    return apiClient.request<TData, never>({
      method: "GET",
      path,
      ...config,
    });
  },
  async post<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ) {
    return apiClient.request<TData, TBody>({
      method: "POST",
      path,
      body,
      ...config,
    });
  },
  async patch<TData, TBody = unknown>(
    path: string,
    body: TBody,
    config?: Omit<ApiRequestConfig<TBody>, "method" | "path" | "body">,
  ) {
    return apiClient.request<TData, TBody>({
      method: "PATCH",
      path,
      body,
      ...config,
    });
  },
};
