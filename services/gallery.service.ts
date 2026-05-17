import { apiClient } from "@/lib/api-client";
import { getMockGalleryEntries } from "@/lib/mock-data/gallery";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type { GalleryEntryDTO } from "@/types/cms.types";

export function getGalleryEntries(): Promise<ApiResponse<GalleryEntryDTO[]>> {
  return resolveServiceCall(
    () => getMockGalleryEntries(),
    () => apiClient.get<GalleryEntryDTO[]>("/gallery/"),
  );
}
