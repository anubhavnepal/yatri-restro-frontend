import { apiClient } from "@/lib/api-client";
import {
  getMockMenuCategories,
  getMockMenuItemBySlug,
  getMockMenuItems,
} from "@/lib/mock-data/menu";
import { resolveServiceCall } from "@/lib/service-runtime";
import type { ApiResponse } from "@/types/api.types";
import type {
  MenuCategoryDTO,
  MenuItemDTO,
  MenuQueryParams,
} from "@/types/menu.types";

export function getMenuItems(
  query?: MenuQueryParams,
): Promise<ApiResponse<MenuItemDTO[]>> {
  return resolveServiceCall(
    () => getMockMenuItems(query),
    () =>
      apiClient.get<MenuItemDTO[]>("/menu/", {
        query,
      }),
  );
}

export function getMenuCategories(): Promise<ApiResponse<MenuCategoryDTO[]>> {
  return resolveServiceCall(
    () => getMockMenuCategories(),
    () => apiClient.get<MenuCategoryDTO[]>("/categories/"),
  );
}

export function getMenuItemBySlug(
  slug: string,
): Promise<ApiResponse<MenuItemDTO>> {
  return resolveServiceCall(
    () => getMockMenuItemBySlug(slug),
    () => apiClient.get<MenuItemDTO>(`/menu/${slug}/`),
  );
}
