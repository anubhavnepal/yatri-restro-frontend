import { z } from "zod";

import {
  FORM_LIMITS,
  getValidationMessages,
  ISO_DATE_PATTERN,
  normalizeIsoDate,
  normalizeOptionalText,
  PHONE_NUMBER_PATTERN,
} from "@/lib/schema/shared";
import { submitReservation } from "@/services/reservation.service";
import type { AppLocale, ISODateString } from "@/types/common.types";
import type { ReservationSubmissionInput } from "@/types/reservation.types";

export type ReservationFormPrefill = {
  date?: ISODateString;
  timeSlotId?: string;
  guestCount?: number;
};

export function createReservationFormSchema(locale: AppLocale = "en") {
  const messages = getValidationMessages(locale);

  return z.object({
    date: z
      .string()
      .trim()
      .min(1, messages.reservation.dateRequired)
      .regex(ISO_DATE_PATTERN, messages.reservation.dateInvalid)
      .transform(normalizeIsoDate),
    timeSlotId: z
      .string()
      .trim()
      .min(1, messages.reservation.timeSlotRequired),
    guestCount: z.coerce
      .number()
      .min(FORM_LIMITS.reservationGuestCountMin, messages.reservation.guestCountMin)
      .max(FORM_LIMITS.reservationGuestCountMax, messages.reservation.guestCountMax)
      .refine(Number.isInteger, messages.reservation.guestCountInteger),
    customerName: z
      .string()
      .trim()
      .min(1, messages.common.nameRequired)
      .max(FORM_LIMITS.customerNameMaxLength, messages.common.nameTooLong),
    customerEmail: z
      .string()
      .trim()
      .min(1, messages.common.emailRequired)
      .max(FORM_LIMITS.emailMaxLength, messages.common.emailTooLong)
      .email(messages.common.emailInvalid),
    customerPhone: z
      .string()
      .trim()
      .min(1, messages.common.phoneRequired)
      .max(FORM_LIMITS.phoneMaxLength, messages.common.phoneTooLong)
      .regex(PHONE_NUMBER_PATTERN, messages.common.phoneInvalid),
    specialRequest: z
      .string()
      .trim()
      .max(
        FORM_LIMITS.specialRequestMaxLength,
        messages.common.specialRequestTooLong,
      )
      .or(z.literal(""))
      .transform((value) => normalizeOptionalText(value)),
  });
}

export type ReservationFormInput = z.input<
  ReturnType<typeof createReservationFormSchema>
>;

export type ReservationFormValues = z.output<
  ReturnType<typeof createReservationFormSchema>
>;

export type ReservationSubmitResult = Awaited<
  ReturnType<typeof submitReservation>
>;

export function createReservationFormDefaults(
  prefill?: ReservationFormPrefill,
): ReservationFormInput {
  return {
    date: prefill?.date ?? "",
    timeSlotId: prefill?.timeSlotId ?? "",
    guestCount: prefill?.guestCount ?? FORM_LIMITS.reservationGuestCountMin,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequest: "",
  };
}

export function mapReservationFormValuesToSubmissionInput(
  values: ReservationFormValues,
): ReservationSubmissionInput {
  return {
    date: values.date,
    time_slot: values.timeSlotId,
    guest_count: values.guestCount,
    customer_name: values.customerName,
    customer_email: values.customerEmail,
    customer_phone: values.customerPhone,
    special_request: values.specialRequest,
  };
}

export function submitReservationForm(
  values: ReservationFormValues,
): Promise<ReservationSubmitResult> {
  return submitReservation(mapReservationFormValuesToSubmissionInput(values));
}
