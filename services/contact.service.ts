import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { ContactFormInput, ContactSubmissionResult } from "@/types/contact.types";

export function submitContactForm(
  payload: ContactFormInput,
): Promise<ApiResponse<ContactSubmissionResult>> {
  return apiClient.post<ContactSubmissionResult, ContactFormInput>(
    "/contact/",
    payload,
  );
}
