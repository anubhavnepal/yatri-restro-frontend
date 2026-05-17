import { apiClient } from "@/lib/api-client";
import {
  getMockReservationAvailability,
  submitMockReservation,
} from "@/lib/mock-data/reservation";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type {
  ReservationAvailabilityParams,
  ReservationAvailabilityResult,
  ReservationSubmissionInput,
  ReservationSubmissionResult,
} from "@/types/reservation.types";

export function getReservationAvailability(
  query: ReservationAvailabilityParams,
): Promise<ApiResponse<ReservationAvailabilityResult>> {
  return resolveServiceCall(
    () => getMockReservationAvailability(query),
    () =>
      apiClient.get<ReservationAvailabilityResult>(
        "/reservations/availability/",
        {
          query,
        },
      ),
  );
}

export function submitReservation(
  payload: ReservationSubmissionInput,
): Promise<ApiResponse<ReservationSubmissionResult>> {
  return resolveServiceCall(
    () => submitMockReservation(payload),
    () =>
      apiClient.post<ReservationSubmissionResult, ReservationSubmissionInput>(
        "/reservations/",
        payload,
      ),
  );
}
