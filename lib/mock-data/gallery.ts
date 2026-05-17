import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type { GalleryEntryDTO } from "@/types/cms.types";

const galleryEntries: GalleryEntryDTO[] = [
  {
    id: "gallery-ambience-1",
    slug: "evening-counter-light",
    title_en: "Evening Counter Light",
    title_ja: "夕刻のカウンター",
    description_en: "A quiet counter setting prepared before first seating.",
    description_ja: "最初のご案内前に整えられた静かなカウンター席。",
    image: {
      id: "gallery-image-1",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      alt_en: "Restaurant counter lit warmly in the evening.",
      alt_ja: "夕刻の柔らかな灯りに包まれたレストランカウンター。",
      width: 1600,
      height: 1067,
    },
  },
  {
    id: "gallery-plating-1",
    slug: "seasonal-plating",
    title_en: "Seasonal Plating",
    title_ja: "季節の盛り付け",
    description_en: "Seasonal plating that balances ritual and warmth.",
    description_ja: "儀式性と温もりを両立させた季節の盛り付け。",
    image: {
      id: "gallery-image-2",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947",
      alt_en: "Seasonal plated dish on a dark ceramic plate.",
      alt_ja: "黒い陶器に盛られた季節料理。",
      width: 1600,
      height: 1067,
    },
  },
];

export async function getMockGalleryEntries(): Promise<
  ApiResponse<GalleryEntryDTO[]>
> {
  return createMockApiResponse("Mock gallery entries loaded.", galleryEntries);
}
