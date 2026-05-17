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
};

export type NewsletterSubscriptionInput = {
  email: string;
  locale?: "en" | "ja";
};

export type NewsletterSubscriptionResult = {
  subscribed: boolean;
};
