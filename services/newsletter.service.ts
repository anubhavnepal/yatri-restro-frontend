import { apiClient } from "@/lib/api-client";
import { subscribeMockNewsletter } from "@/lib/mock-data/newsletter";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type {
  NewsletterSubscriptionInput,
  NewsletterSubscriptionResult,
} from "@/types/contact.types";

export function subscribeToNewsletter(
  payload: NewsletterSubscriptionInput,
): Promise<ApiResponse<NewsletterSubscriptionResult>> {
  return resolveServiceCall(
    () => subscribeMockNewsletter(payload),
    () =>
      apiClient.post<
        NewsletterSubscriptionResult,
        NewsletterSubscriptionInput
      >("/newsletter/", payload),
  );
}
