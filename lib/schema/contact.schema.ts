import { z } from "zod";

import {
  FORM_LIMITS,
  getValidationMessages,
  normalizeOptionalText,
  PHONE_NUMBER_PATTERN,
} from "@/lib/schema/shared";
import { submitContactForm } from "@/services/contact.service";
import type { AppLocale } from "@/types/common.types";
import type { ContactFormInput } from "@/types/contact.types";

export function createContactFormSchema(locale: AppLocale = "en") {
  const messages = getValidationMessages(locale);

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.common.nameRequired)
      .max(FORM_LIMITS.customerNameMaxLength, messages.common.nameTooLong),
    email: z
      .string()
      .trim()
      .min(1, messages.common.emailRequired)
      .max(FORM_LIMITS.emailMaxLength, messages.common.emailTooLong)
      .email(messages.common.emailInvalid),
    phone: z
      .string()
      .trim()
      .max(FORM_LIMITS.phoneMaxLength, messages.common.phoneTooLong)
      .or(z.literal(""))
      .transform((value) => normalizeOptionalText(value))
      .refine(
        (value) => value === undefined || PHONE_NUMBER_PATTERN.test(value),
        messages.common.phoneInvalid,
      ),
    subject: z
      .string()
      .trim()
      .max(FORM_LIMITS.subjectMaxLength, messages.contact.subjectTooLong)
      .or(z.literal(""))
      .transform((value) => normalizeOptionalText(value)),
    message: z
      .string()
      .trim()
      .min(1, messages.contact.messageRequired)
      .max(FORM_LIMITS.longTextMaxLength, messages.contact.messageTooLong),
  });
}

export type ContactFormInputValues = z.input<
  ReturnType<typeof createContactFormSchema>
>;

export type ContactFormValues = z.output<
  ReturnType<typeof createContactFormSchema>
>;

export type ContactSubmitResult = Awaited<ReturnType<typeof submitContactForm>>;

export function createContactFormDefaults(): ContactFormInputValues {
  return {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };
}

export function mapContactFormValuesToSubmissionInput(
  values: ContactFormValues,
): ContactFormInput {
  return values;
}

export function submitContactFormValues(
  values: ContactFormValues,
): Promise<ContactSubmitResult> {
  return submitContactForm(mapContactFormValuesToSubmissionInput(values));
}
