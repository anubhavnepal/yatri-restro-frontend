import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  NewsletterSubscriptionInput,
  NewsletterSubscriptionResult,
} from "@/types/contact.types";

export function subscribeToNewsletter(
  payload: NewsletterSubscriptionInput,
): Promise<ApiResponse<NewsletterSubscriptionResult>> {
  return apiClient.post<
    NewsletterSubscriptionResult,
    NewsletterSubscriptionInput
  >("/newsletter/", payload);
}
