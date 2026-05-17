import { z } from "zod";

import { FORM_LIMITS, getValidationMessages } from "@/lib/schema/shared";
import { subscribeToNewsletter } from "@/services/newsletter.service";
import type { AppLocale } from "@/types/common.types";
import type { NewsletterSubscriptionInput } from "@/types/contact.types";

export function createNewsletterFormSchema(locale: AppLocale = "en") {
  const messages = getValidationMessages(locale);

  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.common.emailRequired)
      .max(FORM_LIMITS.emailMaxLength, messages.common.emailTooLong)
      .email(messages.common.emailInvalid),
    locale: z.enum(["en", "ja"]).optional(),
  });
}

export type NewsletterFormInputValues = z.input<
  ReturnType<typeof createNewsletterFormSchema>
>;

export type NewsletterFormValues = z.output<
  ReturnType<typeof createNewsletterFormSchema>
>;

export type NewsletterSubmitResult = Awaited<
  ReturnType<typeof subscribeToNewsletter>
>;

export function createNewsletterFormDefaults(
  locale: AppLocale,
): NewsletterFormInputValues {
  return {
    email: "",
    locale,
  };
}

export function mapNewsletterFormValuesToSubmissionInput(
  values: NewsletterFormValues,
): NewsletterSubscriptionInput {
  return values;
}

export function submitNewsletterFormValues(
  values: NewsletterFormValues,
): Promise<NewsletterSubmitResult> {
  return subscribeToNewsletter(mapNewsletterFormValuesToSubmissionInput(values));
}
