import { ApiError } from "@/lib/api-error";
import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type {
  MenuCategoryDTO,
  MenuCollectionDTO,
  MenuItemDTO,
  MenuQueryParams,
} from "@/types/menu.types";

const menuCategories: MenuCategoryDTO[] = [
  {
    id: "cat-signature",
    slug: "signature",
    title_en: "Signature Courses",
    title_ja: "シグネチャーコース",
    description_en: "Curated plates that anchor the evening experience.",
    description_ja: "夜の体験を支える厳選の一皿。",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "cat-grill",
    slug: "grill",
    title_en: "Fire & Grill",
    title_ja: "炭火とグリル",
    description_en: "Charcoal-finished mains with a Nepali warmth.",
    description_ja: "ネパールの温もりを感じる炭火仕上げの主菜。",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "cat-sweets",
    slug: "sweets",
    title_en: "Desserts & Tea",
    title_ja: "甘味と茶",
    description_en: "Quiet finishes for a slower close to service.",
    description_ja: "静かな余韻で締めくくる甘味とお茶。",
    is_active: true,
    sort_order: 3,
  },
];

const menuItems: MenuItemDTO[] = [
  {
    id: "item-sekuwa",
    slug: "charcoal-lamb-sekuwa",
    category: menuCategories[1],
    title_en: "Charcoal Lamb Sekuwa",
    title_ja: "炭火ラムセクワ",
    description_en:
      "Tender lamb skewers finished over charcoal with timur and smoked salt.",
    description_ja:
      "ティムールと燻製塩で仕上げた、炭火焼きラムのセクワ。",
    price: 2480,
    image: {
      id: "img-sekuwa",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947",
      alt_en: "Charcoal grilled lamb plated on a dark ceramic dish.",
      alt_ja: "黒い器に盛り付けた炭火焼きラム。",
      width: 1600,
      height: 1067,
    },
    variants: [
      {
        id: "variant-sekuwa-regular",
        name_en: "Regular",
        name_ja: "レギュラー",
        price: 2480,
        is_default: true,
      },
      {
        id: "variant-sekuwa-large",
        name_en: "Large",
        name_ja: "ラージ",
        price: 3180,
      },
    ],
    addons: [
      {
        id: "addon-sekuwa-achaar",
        name_en: "House achar",
        name_ja: "自家製アチャール",
        price: 280,
      },
    ],
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-thakali",
    slug: "thakali-tasting",
    category: menuCategories[0],
    title_en: "Thakali Tasting Set",
    title_ja: "タカリテイスティングセット",
    description_en:
      "A composed tasting of lentils, mountain greens, pickles, and seasonal curry.",
    description_ja:
      "豆、山菜、漬物、季節のカレーを組み合わせたタカリのテイスティング。",
    price: 3200,
    image: {
      id: "img-thakali",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      alt_en: "An elegant tasting set arranged in small bowls.",
      alt_ja: "小鉢で美しく構成されたテイスティングセット。",
      width: 1600,
      height: 1067,
    },
    addons: [
      {
        id: "addon-thakali-rice",
        name_en: "Extra rice",
        name_ja: "ライス追加",
        price: 220,
      },
    ],
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-momo",
    slug: "truffle-jhol-momo",
    category: menuCategories[0],
    title_en: "Truffle Jhol Momo",
    title_ja: "トリュフジョルモモ",
    description_en:
      "Hand-folded momo served with a warm sesame-tomato broth finished with truffle aroma.",
    description_ja:
      "胡麻とトマトの温かなスープにトリュフの香りを添えた手包みモモ。",
    price: 1880,
    is_available: true,
  },
  {
    id: "item-kheer",
    slug: "saffron-kheer",
    category: menuCategories[2],
    title_en: "Saffron Kheer",
    title_ja: "サフランキール",
    description_en:
      "Creamy rice pudding with saffron, pistachio, and a restrained rose finish.",
    description_ja:
      "サフラン、ピスタチオ、ほのかな薔薇で仕上げた濃厚なキール。",
    price: 980,
    is_available: true,
  },
];

function filterMenuItems(query?: MenuQueryParams): MenuItemDTO[] {
  if (!query) {
    return menuItems;
  }

  const normalizedSearch = query.search?.toString().trim().toLowerCase();

  return menuItems.filter((item) => {
    if (query.category) {
      const categorySlug =
        typeof item.category === "string" ? item.category : item.category.slug;

      if (categorySlug !== query.category) {
        return false;
      }
    }

    if (typeof query.featured === "boolean" && item.is_featured !== query.featured) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [
      item.title_en,
      item.title_ja,
      item.description_en,
      item.description_ja,
    ]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });
}

export async function getMockMenuItems(
  query?: MenuQueryParams,
): Promise<ApiResponse<MenuItemDTO[]>> {
  return createMockApiResponse("Mock menu items loaded.", filterMenuItems(query));
}

export async function getMockMenuCategories(): Promise<
  ApiResponse<MenuCategoryDTO[]>
> {
  return createMockApiResponse("Mock menu categories loaded.", menuCategories);
}

export async function getMockMenuItemBySlug(
  slug: string,
): Promise<ApiResponse<MenuItemDTO>> {
  const item = menuItems.find((entry) => entry.slug === slug);

  if (!item) {
    throw new ApiError({
      message: `Menu item "${slug}" was not found in mock data.`,
      statusCode: 404,
      code: "MOCK_MENU_ITEM_NOT_FOUND",
    });
  }

  return createMockApiResponse("Mock menu item loaded.", item);
}

export async function getMockMenuCollection(): Promise<
  ApiResponse<MenuCollectionDTO>
> {
  return createMockApiResponse("Mock menu collection loaded.", {
    categories: menuCategories,
    items: menuItems,
  });
}
