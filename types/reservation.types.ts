import type { ISODateString } from "@/types/common.types";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type ReservationTimeSlotDTO = {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  is_available?: boolean;
};

export type ReservationAvailabilityParams = {
  date: ISODateString;
  guest_count: number;
  time_slot?: string;
};

export type ReservationAvailabilityResult = {
  available: boolean;
  time_slots: ReservationTimeSlotDTO[];
  note?: string;
};

export type ReservationSubmissionInput = {
  date: ISODateString;
  time_slot: string;
  guest_count: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_request?: string;
};

export type ReservationSubmissionResult = {
  id: string;
  status: ReservationStatus;
  message?: string;
};

export type ReservationDraft = {
  date?: ISODateString;
  time_slot?: string;
  guest_count?: number;
};
