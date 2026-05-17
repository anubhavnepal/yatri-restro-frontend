import type { ApiResponse } from "@/types/api.types";

export function createMockApiResponse<TData>(
  message: string,
  data: TData,
): ApiResponse<TData> {
  return {
    success: true,
    message,
    data,
  };
}
