import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { OrderSubmissionInput, OrderSubmissionResult } from "@/types/order.types";

export function submitOrder(
  payload: OrderSubmissionInput,
): Promise<ApiResponse<OrderSubmissionResult>> {
  return apiClient.post<OrderSubmissionResult, OrderSubmissionInput>(
    "/orders/",
    payload,
  );
}
