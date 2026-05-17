import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { GalleryEntryDTO } from "@/types/cms.types";

export function getGalleryEntries(): Promise<ApiResponse<GalleryEntryDTO[]>> {
  return apiClient.get<GalleryEntryDTO[]>("/gallery/");
}
