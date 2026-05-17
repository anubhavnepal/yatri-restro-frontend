import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type {
  ContactFormInput,
  ContactSubmissionResult,
} from "@/types/contact.types";

export async function submitMockContactForm(
  payload: ContactFormInput,
): Promise<ApiResponse<ContactSubmissionResult>> {
  void payload;

  return createMockApiResponse("Mock contact request submitted.", {
    id: `contact-${Date.now()}`,
    received: true,
    received_at: new Date().toISOString(),
  });
}
