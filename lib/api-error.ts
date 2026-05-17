export type ApiErrorOptions = {
  message: string;
  statusCode?: number;
  details?: unknown;
};

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor({ message, statusCode, details }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
