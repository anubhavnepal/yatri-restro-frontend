import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import type { AppLocale } from "@/types/common.types";
import type { MenuAddonDTO, MenuItemDTO, MenuVariantDTO } from "@/types/menu.types";

export type CartSelectionLike = {
  menuItemId: string;
  quantity: number;
  variantId?: string;
  addonIds: string[];
};

export type CartPreviewLine = {
  menuItemId: string;
  quantity: number;
  title: string;
  imageAlt?: string;
  imageUrl?: string;
  unitPrice: number;
  lineTotal: number;
  variantName?: string;
  addonNames: string[];
  isAvailable: boolean;
};

export type CartPreviewSummary = {
  lines: CartPreviewLine[];
  itemCount: number;
  quantityTotal: number;
  estimatedSubtotal: number;
  isEstimated: true;
};

function getMenuVariant(item: MenuItemDTO, variantId?: string): MenuVariantDTO | undefined {
  if (!variantId) {
    return item.variants?.find((variant) => variant.is_default);
  }

  return item.variants?.find((variant) => variant.id === variantId);
}

function getMenuAddons(item: MenuItemDTO, addonIds: string[]): MenuAddonDTO[] {
  if (!item.addons || addonIds.length === 0) {
    return [];
  }

  return addonIds
    .map((addonId) => item.addons?.find((addon) => addon.id === addonId))
    .filter((addon): addon is MenuAddonDTO => Boolean(addon));
}

export function getDefaultVariantId(item: MenuItemDTO): string | undefined {
  return item.variants?.find((variant) => variant.is_default)?.id;
}

export function buildCartPreviewSummary(
  selections: CartSelectionLike[],
  menuItems: MenuItemDTO[],
  locale: AppLocale,
): CartPreviewSummary {
  const menuLookup = new Map(menuItems.map((item) => [item.id, item]));

  const lines = selections.map((selection): CartPreviewLine => {
    const item = menuLookup.get(selection.menuItemId);

    if (!item) {
      return {
        menuItemId: selection.menuItemId,
        quantity: selection.quantity,
        title: selection.menuItemId,
        unitPrice: 0,
        lineTotal: 0,
        addonNames: selection.addonIds,
        isAvailable: false,
      };
    }

    const variant = getMenuVariant(item, selection.variantId);
    const addons = getMenuAddons(item, selection.addonIds);
    const addonTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
    const unitPrice = (variant?.price ?? item.price) + addonTotal;

    return {
      menuItemId: selection.menuItemId,
      quantity: selection.quantity,
      title: getLocalizedField(item, "title", locale),
      imageAlt:
        getLocalizedOptionalField(item.image ?? {}, "alt", locale) ??
        getLocalizedOptionalField(item.image ?? {}, "caption", locale) ??
        getLocalizedField(item, "title", locale),
      imageUrl: item.image?.url,
      unitPrice,
      lineTotal: unitPrice * selection.quantity,
      variantName: variant ? getLocalizedField(variant, "name", locale) : undefined,
      addonNames: addons.map((addon) => getLocalizedField(addon, "name", locale)),
      isAvailable: item.is_available,
    };
  });

  return {
    lines,
    itemCount: selections.length,
    quantityTotal: selections.reduce((sum, item) => sum + item.quantity, 0),
    estimatedSubtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    isEstimated: true,
  };
}
