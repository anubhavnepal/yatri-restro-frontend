import enMessages from "@/messages/en.json";
import jaMessages from "@/messages/ja.json";
import { isNonEmptyString } from "@/lib/utils";
import type { AppLocale, ISODateString } from "@/types/common.types";

export const FORM_LIMITS = {
  customerNameMaxLength: 120,
  emailMaxLength: 160,
  phoneMaxLength: 32,
  subjectMaxLength: 140,
  shortTextMaxLength: 120,
  longTextMaxLength: 1500,
  specialRequestMaxLength: 500,
  reservationGuestCountMin: 1,
  reservationGuestCountMax: 20,
} as const;

export const PHONE_NUMBER_PATTERN = /^[0-9+()\-\s]{8,20}$/;

export const POSTAL_CODE_PATTERN = /^[0-9A-Za-z\- ]{3,12}$/;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const validationMessagesByLocale = {
  en: enMessages.validation,
  ja: jaMessages.validation,
} as const;

export type ValidationMessages = (typeof validationMessagesByLocale)["en"];

export function getValidationMessages(locale: AppLocale): ValidationMessages {
  return validationMessagesByLocale[locale];
}

export function normalizeOptionalText(
  value: string | null | undefined,
): string | undefined {
  if (!isNonEmptyString(value)) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeIsoDate(value: string): ISODateString {
  return value.trim();
}
