import type { AppLocale, ISODateTimeString } from "@/types/common.types";

export type ContactFormInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type ContactSubmissionResult = {
  id?: string;
  received: boolean;
  received_at?: ISODateTimeString;
};

export type NewsletterSubscriptionInput = {
  email: string;
  locale?: AppLocale;
};

export type NewsletterSubscriptionResult = {
  subscribed: boolean;
  received_at?: ISODateTimeString;
};
