import type { AppLocale, ISODateTimeString } from "@/types/common.types";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiValidationIssue = {
  field: string;
  message: string;
};

export type ApiErrorPayload = {
  success: false;
  message: string;
  data: null;
  errors?: ApiValidationIssue[];
  statusCode?: number;
};

export type ApiHttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiQueryParams = Record<
  string,
  string | number | boolean | AppLocale | undefined
>;

export type ApiRequestConfig<TBody = unknown> = {
  method: ApiHttpMethod;
  path: string;
  body?: TBody;
  query?: ApiQueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  requestedAt?: ISODateTimeString;
};
