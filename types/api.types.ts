import type { AppLocale, ISODateTimeString } from "@/types/common.types";

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiValidationIssue = {
  field: string;
  message: string;
  code?: string;
};

export type ApiErrorPayload = {
  success: false;
  message: string;
  data: null;
  errors?: ApiValidationIssue[];
  statusCode?: number;
  code?: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorPayload;

export type ApiHttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiQueryParamPrimitive = string | number | boolean | AppLocale;

export type ApiQueryParamValue =
  | ApiQueryParamPrimitive
  | ApiQueryParamPrimitive[]
  | null
  | undefined;

export type ApiQueryParams = Record<string, ApiQueryParamValue>;

export type ApiRequestConfig<TBody = unknown> = {
  method: ApiHttpMethod;
  path: string;
  body?: TBody;
  query?: ApiQueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  requestedAt?: ISODateTimeString;
  timeoutMs?: number;
};
