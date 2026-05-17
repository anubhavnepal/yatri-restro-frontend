'use client';

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { buildCartPreviewSummary, getDefaultVariantId } from "@/lib/cart-preview";
import { formatCurrency } from "@/lib/formatters";
import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import { useCartStore } from "@/store/cart.store";
import type { AppLocale } from "@/types/common.types";
import type { MenuCategoryDTO, MenuItemDTO } from "@/types/menu.types";

type MenuShellProps = {
  categories: MenuCategoryDTO[];
  items: MenuItemDTO[];
};

function getCategorySlug(item: MenuItemDTO): string | null {
  return typeof item.category === "string" ? item.category : item.category.slug;
}

export function MenuShell({ categories, items }: MenuShellProps) {
  const t = useTranslations("MenuPage");
  const locale = useLocale() as AppLocale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((item) => getCategorySlug(item) === activeCategory);
  }, [activeCategory, items]);

  const cartPreview = useMemo(
    () => buildCartPreviewSummary(cartItems, items, locale),
    [cartItems, items, locale],
  );

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <div className="flex flex-col gap-[var(--space-6)]">
        <div className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] sm:text-4xl">
              {t("title")}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className={activeCategory === "all" ? "button-primary" : "button-secondary"}
              onClick={() => setActiveCategory("all")}
              type="button"
            >
              {t("allCategories")}
            </button>
            {categories.map((category) => (
              <button
                className={activeCategory === category.slug ? "button-primary" : "button-secondary"}
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                type="button"
              >
                {getLocalizedField(category, "title", locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-[var(--space-4)]">
          {filteredItems.map((item) => {
            const title = getLocalizedField(item, "title", locale);
            const description = getLocalizedOptionalField(item, "description", locale);
            const categoryTitle =
              typeof item.category === "string"
                ? item.category
                : getLocalizedField(item.category, "title", locale);

            return (
              <article
                className="surface-panel flex flex-col gap-[var(--space-4)] px-[var(--space-5)] py-[var(--space-5)] sm:px-[var(--space-6)]"
                key={item.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                      {categoryTitle}
                    </p>
                    <h2 className="font-serif text-2xl tracking-[0.04em]">
                      <Link
                        className="transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:text-[color:var(--color-accent)]"
                        href={`/menu/${item.slug}`}
                        prefetch={false}
                      >
                        {title}
                      </Link>
                    </h2>
                    {description ? (
                      <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                        {description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-[color:var(--color-foreground-soft)]">
                      {t("startingFromLabel")}
                    </p>
                    <p className="text-lg font-medium text-[color:var(--color-foreground)]">
                      {formatCurrency(item.price, locale)}
                    </p>
                  </div>
                </div>

                {item.variants?.length ? (
                  <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                    {t("variantsLabel")}:{" "}
                    {item.variants
                      .map((variant) => getLocalizedField(variant, "name", locale))
                      .join(", ")}
                  </p>
                ) : null}

                {item.addons?.length ? (
                  <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                    {t("addonsLabel")}:{" "}
                    {item.addons
                      .map((addon) => getLocalizedField(addon, "name", locale))
                      .join(", ")}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-[color:var(--color-foreground-soft)]">
                      {item.is_available
                        ? t("availabilityAvailable")
                        : t("availabilityUnavailable")}
                    </p>
                    <Link
                      className="text-sm font-medium text-[color:var(--color-accent)] transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:text-[color:var(--color-accent-strong)]"
                      href={`/menu/${item.slug}`}
                      prefetch={false}
                    >
                      {t("viewDetailCta")}
                    </Link>
                  </div>
                  <button
                    className={item.is_available ? "button-primary" : "button-secondary opacity-60"}
                    disabled={!item.is_available}
                    onClick={() =>
                      addItem({
                        menuItemId: item.id,
                        quantity: 1,
                        variantId: getDefaultVariantId(item),
                        addonIds: [],
                      })
                    }
                    type="button"
                  >
                    {item.is_available ? t("addToCartCta") : t("unavailableCta")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)]">
        <h2 className="font-serif text-2xl tracking-[0.04em]">{t("cartSummaryTitle")}</h2>
        <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
          {t("cartSummaryDescription")}
        </p>
        <dl className="grid gap-3 text-sm leading-7">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("lineItemsLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">{cartPreview.itemCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("quantityTotalLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">
              {cartPreview.quantityTotal}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("estimatedSubtotalLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">
              {formatCurrency(cartPreview.estimatedSubtotal, locale)}
            </dd>
          </div>
        </dl>
        <p className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] px-[var(--space-4)] py-[var(--space-4)] text-sm leading-7 text-[color:var(--color-foreground-soft)]">
          {t("pricingDisclaimer")}
        </p>
        <Link className="button-secondary" href="/cart">
          {t("openCartCta")}
        </Link>
      </aside>
    </div>
  );
}
