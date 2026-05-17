'use client';

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart.store";

function formatAddonSummary(addonIds: string[]) {
  return addonIds.length > 0 ? addonIds.join(", ") : null;
}

export function CartShell() {
  const t = useTranslations("CartPage");
  const items = useCartStore((state) => state.items);
  const orderType = useCartStore((state) => state.orderType);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setOrderType = useCartStore((state) => state.setOrderType);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <div className="surface-panel flex flex-col gap-[var(--space-6)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
          <button
            className={orderType === "DINE_IN" ? "button-primary" : "button-secondary"}
            onClick={() => setOrderType("DINE_IN")}
            type="button"
          >
            {t("dineInLabel")}
          </button>
          <button
            className={orderType === "DELIVERY" ? "button-primary" : "button-secondary"}
            onClick={() => setOrderType("DELIVERY")}
            type="button"
          >
            {t("deliveryLabel")}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--color-border)] px-[var(--space-5)] py-[var(--space-6)]">
            <h2 className="font-serif text-2xl tracking-[0.04em]">{t("emptyTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-foreground-muted)]">
              {t("emptyDescription")}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-foreground-soft)]">
              {t("integrationNote")}
            </p>
            <div className="mt-[var(--space-5)]">
              <Link className="button-secondary inline-flex" href="/">
                {t("returnHomeCta")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[var(--space-4)]">
            {items.map((item) => {
              const addonSummary = formatAddonSummary(item.addonIds);

              return (
                <article
                  className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-5)] py-[var(--space-5)]"
                  key={JSON.stringify(item)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-base font-medium text-[color:var(--color-foreground)]">
                        {t("itemLabel")}: <span className="font-mono">{item.menuItemId}</span>
                      </h2>
                      {item.variantId ? (
                        <p className="text-sm text-[color:var(--color-foreground-muted)]">
                          {t("variantLabel")}: <span className="font-mono">{item.variantId}</span>
                        </p>
                      ) : null}
                      {addonSummary ? (
                        <p className="text-sm text-[color:var(--color-foreground-muted)]">
                          {t("addonsLabel")}: <span className="font-mono">{addonSummary}</span>
                        </p>
                      ) : null}
                    </div>

                    <button
                      className="button-ghost self-start"
                      onClick={() =>
                        removeItem({
                          menuItemId: item.menuItemId,
                          variantId: item.variantId,
                          addonIds: item.addonIds,
                        })
                      }
                      type="button"
                    >
                      {t("removeLabel")}
                    </button>
                  </div>

                  <div className="mt-[var(--space-4)] flex items-center gap-3">
                    <span className="text-sm text-[color:var(--color-foreground-muted)]">
                      {t("quantityLabel")}
                    </span>
                    <button
                      aria-label={t("quantityDecrease")}
                      className="button-ghost h-10 w-10 justify-center"
                      onClick={() =>
                        updateQuantity(
                          {
                            menuItemId: item.menuItemId,
                            variantId: item.variantId,
                            addonIds: item.addonIds,
                          },
                          item.quantity - 1,
                        )
                      }
                      type="button"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center font-medium text-[color:var(--color-foreground)]">
                      {item.quantity}
                    </span>
                    <button
                      aria-label={t("quantityIncrease")}
                      className="button-ghost h-10 w-10 justify-center"
                      onClick={() =>
                        updateQuantity(
                          {
                            menuItemId: item.menuItemId,
                            variantId: item.variantId,
                            addonIds: item.addonIds,
                          },
                          item.quantity + 1,
                        )
                      }
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)]">
        <h2 className="font-serif text-2xl tracking-[0.04em]">{t("summaryTitle")}</h2>
        <dl className="grid gap-3 text-sm leading-7">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("orderTypeLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">
              {orderType === "DINE_IN" ? t("dineInLabel") : t("deliveryLabel")}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("lineItemsLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">{items.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("quantityTotalLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">{totalQuantity}</dd>
          </div>
        </dl>

        <p className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] px-[var(--space-4)] py-[var(--space-4)] text-sm leading-7 text-[color:var(--color-foreground-soft)]">
          {t("pricingNote")}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            aria-disabled={items.length === 0}
            className={items.length === 0 ? "button-primary pointer-events-none opacity-50" : "button-primary"}
            href="/checkout"
          >
            {t("checkoutCta")}
          </Link>
          <button className="button-secondary" onClick={clearCart} type="button">
            {t("clearCartLabel")}
          </button>
          <Link className="button-ghost" href="/reservation">
            {t("reservationCta")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
