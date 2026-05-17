export type CmsImageAsset = {
  id: string;
  url: string;
  alt_en?: string | null;
  alt_ja?: string | null;
  caption_en?: string | null;
  caption_ja?: string | null;
  width?: number | null;
  height?: number | null;
};

export type CmsSeoFields = {
  meta_title_en?: string | null;
  meta_title_ja?: string | null;
  meta_description_en?: string | null;
  meta_description_ja?: string | null;
};

export type GalleryEntryDTO = CmsSeoFields & {
  id: string;
  slug: string;
  title_en: string;
  title_ja: string;
  description_en?: string | null;
  description_ja?: string | null;
  image: CmsImageAsset;
  video_url?: string | null;
};
