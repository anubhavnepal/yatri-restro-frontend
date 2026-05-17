import type { ApiQueryParams } from "@/types/api.types";
import type { CmsImageAsset } from "@/types/cms.types";

export type MenuCategoryDTO = {
  id: string;
  slug: string;
  title_en: string;
  title_ja: string;
  description_en?: string | null;
  description_ja?: string | null;
  image?: CmsImageAsset | null;
  is_active?: boolean;
  sort_order?: number;
};

export type MenuVariantDTO = {
  id: string;
  name_en: string;
  name_ja: string;
  price: number;
  is_default?: boolean;
};

export type MenuAddonDTO = {
  id: string;
  name_en: string;
  name_ja: string;
  price: number;
};

export type MenuItemDTO = {
  id: string;
  slug: string;
  category: MenuCategoryDTO | string;
  title_en: string;
  title_ja: string;
  description_en?: string | null;
  description_ja?: string | null;
  price: number;
  image?: CmsImageAsset | null;
  gallery?: CmsImageAsset[];
  variants?: MenuVariantDTO[];
  addons?: MenuAddonDTO[];
  is_available: boolean;
  is_featured?: boolean;
};

export type MenuQueryParams = ApiQueryParams & {
  category?: string;
  search?: string;
  featured?: boolean;
};

export type MenuCollectionDTO = {
  categories: MenuCategoryDTO[];
  items: MenuItemDTO[];
};
