import type { ApiErrorPayload, ApiValidationIssue } from "@/types/api.types";

export type ApiErrorOptions = {
  message: string;
  statusCode?: number;
  details?: unknown;
  code?: string;
  errors?: ApiValidationIssue[];
  response?: ApiErrorPayload | null;
  isNetworkError?: boolean;
  isTimeout?: boolean;
};

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly details?: unknown;
  readonly code?: string;
  readonly errors?: ApiValidationIssue[];
  readonly response?: ApiErrorPayload | null;
  readonly isNetworkError: boolean;
  readonly isTimeout: boolean;

  constructor({
    message,
    statusCode,
    details,
    code,
    errors,
    response = null,
    isNetworkError = false,
    isTimeout = false,
  }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
    this.errors = errors;
    this.response = response;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
