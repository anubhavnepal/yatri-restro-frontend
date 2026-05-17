import { apiClient } from "@/lib/api-client";
import { submitMockContactForm } from "@/lib/mock-data/contact";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type { ContactFormInput, ContactSubmissionResult } from "@/types/contact.types";

export function submitContactForm(
  payload: ContactFormInput,
): Promise<ApiResponse<ContactSubmissionResult>> {
  return resolveServiceCall(
    () => submitMockContactForm(payload),
    () =>
      apiClient.post<ContactSubmissionResult, ContactFormInput>(
        "/contact/",
        payload,
      ),
  );
}
