'use client';

import { Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { buildCartPreviewSummary, getDefaultVariantId } from "@/lib/cart-preview";
import { formatCurrency } from "@/lib/formatters";
import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import { useCartStore } from "@/store/cart.store";
import type { AppLocale } from "@/types/common.types";
import type { MenuCategoryDTO, MenuItemDTO } from "@/types/menu.types";
import { DetailSummary } from "@/components/ui/DetailSummary";

type MenuShellProps = {
  categories: MenuCategoryDTO[];
  items: MenuItemDTO[];
};

function getCategorySlug(item: MenuItemDTO): string | null {
  return typeof item.category === "string" ? item.category : item.category.slug;
}

export function MenuShell({ categories, items }: MenuShellProps) {
  const t = useTranslations("MenuPage");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [recentlyAddedItemId, setRecentlyAddedItemId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current);
      }
    };
  }, []);

  function handleAddToCart(item: MenuItemDTO) {
    addItem({
      menuItemId: item.id,
      quantity: 1,
      variantId: getDefaultVariantId(item),
      addonIds: [],
    });

    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }

    setRecentlyAddedItemId(item.id);

    addFeedbackTimeoutRef.current = setTimeout(() => {
      setRecentlyAddedItemId((currentItemId) =>
        currentItemId === item.id ? null : currentItemId,
      );
    }, 2400);
  }

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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 space-y-[var(--space-6)]">
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

          <div className="section-card gap-3">
            <div className="eyebrow-cluster">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-foreground-soft)]">
                {t("allCategories")}
              </p>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[color:rgba(201,168,105,0.24)]"
              />
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
        </div>

        <div className="grid gap-[var(--space-4)]">
          {filteredItems.map((item) => {
            const title = getLocalizedField(item, "title", locale);
            const description = getLocalizedOptionalField(item, "description", locale);
            const isRecentlyAdded = recentlyAddedItemId === item.id;
            const categoryTitle =
              typeof item.category === "string"
                ? item.category
                : getLocalizedField(item.category, "title", locale);
            const imageAlt =
              item.image
                ? getLocalizedOptionalField(item.image, "alt", locale) ??
                  getLocalizedOptionalField(item.image, "caption", locale) ??
                  title
                : title;

            return (
              <article
                className="surface-panel overflow-hidden"
                key={item.id}
              >
                <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-4)] sm:p-[var(--space-5)]">
                  <div className="flex flex-col gap-[var(--space-4)] md:flex-row md:items-start">
                    {item.image ? (
                      <div className="w-full shrink-0 md:w-[220px]">
                        <div className="menu-card-media aspect-[4/3] w-full">
                          <Image
                            alt={imageAlt}
                            className="h-full w-full object-contain"
                            src={item.image.url}
                            width={192}
                            height={144}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full shrink-0 md:w-[220px]">
                        <div className="menu-card-media aspect-[4/3] w-full">
                          <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--color-foreground-soft)]">
                            {categoryTitle}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1 space-y-2">
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
                        <div className="shrink-0 md:text-right">
                          <p className="text-sm text-[color:var(--color-foreground-soft)]">
                            {t("startingFromLabel")}
                          </p>
                          <p className="text-lg font-medium text-[color:var(--color-foreground)]">
                            {formatCurrency(item.price, locale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.variants?.length || item.addons?.length ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {item.variants?.length ? (
                        <div className="section-card gap-2">
                          <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                            {t("variantsLabel")}
                          </p>
                          <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                            {item.variants
                              .map((variant) => getLocalizedField(variant, "name", locale))
                              .join(", ")}
                          </p>
                        </div>
                      ) : null}

                      {item.addons?.length ? (
                        <div className="section-card gap-2">
                          <p className="text-sm font-medium text-[color:var(--color-foreground)]">
                            {t("addonsLabel")}
                          </p>
                          <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                            {item.addons
                              .map((addon) => getLocalizedField(addon, "name", locale))
                              .join(", ")}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="divider-top flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="min-w-0 flex flex-col gap-1">
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
                      aria-label={
                        item.is_available
                          ? isRecentlyAdded
                            ? tCommon("added")
                            : tCommon("addToCart")
                          : t("unavailableCta")
                      }
                      className={
                        item.is_available
                          ? "button-primary button-cart-action self-start md:self-end"
                          : "button-secondary self-start opacity-60 md:self-end"
                      }
                      data-added={item.is_available && isRecentlyAdded ? "true" : "false"}
                      disabled={!item.is_available}
                      onClick={() => handleAddToCart(item)}
                      type="button"
                    >
                      {item.is_available ? (
                        <>
                          {isRecentlyAdded ? (
                            <Check aria-hidden="true" size={16} strokeWidth={2.25} />
                          ) : (
                            <ShoppingCart aria-hidden="true" size={16} strokeWidth={2.1} />
                          )}
                          <span className="inline-flex min-w-[8.75rem] items-center justify-center whitespace-nowrap">
                            {isRecentlyAdded ? tCommon("added") : tCommon("addToCart")}
                          </span>
                          <span aria-live="polite" className="sr-only">
                            {isRecentlyAdded ? tCommon("added") : ""}
                          </span>
                        </>
                      ) : (
                        t("unavailableCta")
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="min-w-0 xl:sticky xl:top-[var(--space-6)] xl:self-start">
        <div className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)]">
          <h2 className="font-serif text-2xl tracking-[0.04em]">{t("cartSummaryTitle")}</h2>
          <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
            {t("cartSummaryDescription")}
          </p>
          <div className="section-card">
            <DetailSummary
              items={[
                { label: t("lineItemsLabel"), value: cartPreview.itemCount },
                { label: t("quantityTotalLabel"), value: cartPreview.quantityTotal },
                {
                  label: t("estimatedSubtotalLabel"),
                  value: formatCurrency(cartPreview.estimatedSubtotal, locale),
                },
              ]}
            />
          </div>
          <p className="support-note">
            {t("pricingDisclaimer")}
          </p>
          <Link className="button-secondary" href="/cart">
            {t("openCartCta")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
