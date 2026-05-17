import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type {
  ReservationAvailabilityParams,
  ReservationAvailabilityResult,
  ReservationSubmissionInput,
  ReservationSubmissionResult,
  ReservationTimeSlotDTO,
} from "@/types/reservation.types";

const reservationTimeSlots: ReservationTimeSlotDTO[] = [
  {
    id: "18-00",
    label: "18:00",
    start_time: "18:00",
    end_time: "19:45",
    is_available: true,
  },
  {
    id: "19-30",
    label: "19:30",
    start_time: "19:30",
    end_time: "21:15",
    is_available: true,
  },
  {
    id: "21-00",
    label: "21:00",
    start_time: "21:00",
    end_time: "22:45",
    is_available: true,
  },
];

function filterTimeSlots(query: ReservationAvailabilityParams) {
  if (!query.time_slot) {
    return reservationTimeSlots;
  }

  return reservationTimeSlots.filter((slot) => slot.id === query.time_slot);
}

export async function getMockReservationAvailability(
  query: ReservationAvailabilityParams,
): Promise<ApiResponse<ReservationAvailabilityResult>> {
  return createMockApiResponse("Mock reservation availability loaded.", {
    available: true,
    time_slots: filterTimeSlots(query),
    note: "Preview only. Final availability and conflict checks come from the backend.",
    is_estimate: true,
  });
}

export async function submitMockReservation(
  payload: ReservationSubmissionInput,
): Promise<ApiResponse<ReservationSubmissionResult>> {
  return createMockApiResponse("Mock reservation request submitted.", {
    id: `mock-reservation-${payload.date}-${payload.time_slot}`,
    status: "PENDING",
    reservation_reference: `RES-${payload.date.replace(/-/g, "")}-${payload.time_slot}`,
    message:
      "This is a demo reservation response. Backend confirmation remains the final authority.",
  });
}
