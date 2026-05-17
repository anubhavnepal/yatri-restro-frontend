'use client';

import { Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { getDefaultVariantId } from "@/lib/cart-preview";
import { formatCurrency } from "@/lib/formatters";
import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import { useCartStore } from "@/store/cart.store";
import type { AppLocale } from "@/types/common.types";
import type { MenuItemDTO } from "@/types/menu.types";

type MenuDetailShellProps = {
  item: MenuItemDTO;
};

export function MenuDetailShell({ item }: MenuDetailShellProps) {
  const t = useTranslations("MenuDetailPage");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const addItem = useCartStore((state) => state.addItem);
  const [showAddedState, setShowAddedState] = useState(false);
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const title = getLocalizedField(item, "title", locale);
  const description = getLocalizedOptionalField(item, "description", locale);
  const categoryTitle =
    typeof item.category === "string"
      ? item.category
      : getLocalizedField(item.category, "title", locale);
  const imageAlt =
    item.image ? getLocalizedOptionalField(item.image, "alt", locale) ?? title : title;

  function handleAddToCart() {
    addItem({
      addonIds: [],
      menuItemId: item.id,
      quantity: 1,
      variantId: getDefaultVariantId(item),
    });

    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }

    setShowAddedState(true);
    addFeedbackTimeoutRef.current = setTimeout(() => {
      setShowAddedState(false);
    }, 2400);
  }

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="surface-panel overflow-hidden">
        {item.image ? (
          <div className="relative aspect-[4/3] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1280px) 52rem, (min-width: 1024px) 60vw, 100vw"
              src={item.image.url}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
          <div className="eyebrow-cluster">
            <p className="eyebrow">{t("eyebrow")}</p>
            <span className="rounded-full border border-[color:var(--color-border-strong)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--color-foreground-soft)]">
              {t("categoryLabel")}: {categoryTitle}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {item.variants?.length ? (
            <div className="section-card gap-3">
              <h2 className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("variantsLabel")}
              </h2>
              <ul className="grid gap-2 text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                {item.variants.map((variant) => (
                  <li
                    className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-3)]"
                    key={variant.id}
                  >
                    <span>{getLocalizedField(variant, "name", locale)}</span>
                    <span className="font-medium text-[color:var(--color-foreground)]">
                      {formatCurrency(variant.price, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {item.addons?.length ? (
            <div className="section-card gap-3">
              <h2 className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("addonsLabel")}
              </h2>
              <ul className="grid gap-2 text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                {item.addons.map((addon) => (
                  <li
                    className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-3)]"
                    key={addon.id}
                  >
                    <span>{getLocalizedField(addon, "name", locale)}</span>
                    <span className="font-medium text-[color:var(--color-foreground)]">
                      {formatCurrency(addon.price, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] lg:sticky lg:top-[var(--space-6)] lg:self-start">
        <div className="section-card gap-2">
          <h2 className="font-serif text-2xl tracking-[0.04em]">
            {t("startingFromLabel")}
          </h2>
          <p className="text-2xl font-medium text-[color:var(--color-foreground)]">
            {formatCurrency(item.price, locale)}
          </p>
          <p className="text-sm text-[color:var(--color-foreground-soft)]">
            {item.is_available
              ? t("availabilityAvailable")
              : t("availabilityUnavailable")}
          </p>
        </div>

        <button
          aria-label={
            item.is_available
              ? showAddedState
                ? tCommon("added")
                : tCommon("addToCart")
              : t("unavailableCta")
          }
          className={
            item.is_available
              ? "button-primary button-cart-action"
              : "button-secondary opacity-60"
          }
          data-added={item.is_available && showAddedState ? "true" : "false"}
          disabled={!item.is_available}
          onClick={handleAddToCart}
          type="button"
        >
          {item.is_available ? (
            <>
              {showAddedState ? (
                <Check aria-hidden="true" size={16} strokeWidth={2.25} />
              ) : (
                <ShoppingCart aria-hidden="true" size={16} strokeWidth={2.1} />
              )}
              <span className="inline-flex min-w-[8.75rem] items-center justify-center whitespace-nowrap">
                {showAddedState ? tCommon("added") : tCommon("addToCart")}
              </span>
              <span aria-live="polite" className="sr-only">
                {showAddedState ? tCommon("added") : ""}
              </span>
            </>
          ) : (
            t("unavailableCta")
          )}
        </button>

        <div className="support-note">
          <p className="support-note-title">
            {t("pricingTitle")}
          </p>
          <p>{t("pricingDescription")}</p>
        </div>

        <div className="section-card text-sm leading-7 text-[color:var(--color-foreground-muted)]">
          <p className="font-medium text-[color:var(--color-foreground)]">
            {t("detailNoteTitle")}
          </p>
          <p>{t("detailNoteDescription")}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link className="button-secondary" href="/menu">
            {t("backToMenuCta")}
          </Link>
          <Link className="button-ghost" href="/cart">
            {t("openCartCta")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
