import { apiClient } from "@/lib/api-client";
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
  return apiClient.get<ReservationAvailabilityResult>("/reservations/availability/", {
    query,
  });
}

export function submitReservation(
  payload: ReservationSubmissionInput,
): Promise<ApiResponse<ReservationSubmissionResult>> {
  return apiClient.post<ReservationSubmissionResult, ReservationSubmissionInput>(
    "/reservations/",
    payload,
  );
}
