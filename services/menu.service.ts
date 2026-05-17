import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  MenuCategoryDTO,
  MenuItemDTO,
  MenuQueryParams,
} from "@/types/menu.types";

export function getMenuItems(
  query?: MenuQueryParams,
): Promise<ApiResponse<MenuItemDTO[]>> {
  return apiClient.get<MenuItemDTO[]>("/menu/", {
    query,
  });
}

export function getMenuCategories(): Promise<ApiResponse<MenuCategoryDTO[]>> {
  return apiClient.get<MenuCategoryDTO[]>("/categories/");
}

export function getMenuItemBySlug(
  slug: string,
): Promise<ApiResponse<MenuItemDTO>> {
  return apiClient.get<MenuItemDTO>(`/menu/${slug}/`);
}
