import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type {
  NewsletterSubscriptionInput,
  NewsletterSubscriptionResult,
} from "@/types/contact.types";

export async function subscribeMockNewsletter(
  payload: NewsletterSubscriptionInput,
): Promise<ApiResponse<NewsletterSubscriptionResult>> {
  void payload;

  return createMockApiResponse("Mock newsletter subscription submitted.", {
    subscribed: true,
    received_at: new Date().toISOString(),
  });
}
