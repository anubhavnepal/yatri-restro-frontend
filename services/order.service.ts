import { apiClient } from "@/lib/api-client";
import { submitMockOrder } from "@/lib/mock-data/order";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type { OrderSubmissionInput, OrderSubmissionResult } from "@/types/order.types";

export function submitOrder(
  payload: OrderSubmissionInput,
): Promise<ApiResponse<OrderSubmissionResult>> {
  return resolveServiceCall(
    () => submitMockOrder(payload),
    () =>
      apiClient.post<OrderSubmissionResult, OrderSubmissionInput>(
        "/orders/",
        payload,
      ),
  );
}
