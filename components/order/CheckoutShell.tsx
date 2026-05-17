'use client';

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import { buildCartPreviewSummary } from "@/lib/cart-preview";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/formatters";
import { createZodResolver } from "@/lib/schema/react-hook-form";
import {
  createOrderCheckoutFormDefaults,
  createOrderCheckoutFormSchema,
  submitOrderCheckoutForm,
  type OrderCheckoutFormInput,
} from "@/lib/schema/order.schema";
import { useCartStore } from "@/store/cart.store";
import type { AppLocale } from "@/types/common.types";
import type { MenuItemDTO } from "@/types/menu.types";
import type { OrderPricingPreview } from "@/types/order.types";

type CheckoutShellProps = {
  menuItems: MenuItemDTO[];
};

export function CheckoutShell({ menuItems }: CheckoutShellProps) {
  const t = useTranslations("CheckoutPage");
  const locale = useLocale() as AppLocale;
  const orderType = useCartStore((state) => state.orderType);
  const setOrderType = useCartStore((state) => state.setOrderType);
  const items = useCartStore((state) => state.items);

  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [pricingPreview, setPricingPreview] = useState<OrderPricingPreview | null>(null);
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const [orderStatusLabel, setOrderStatusLabel] = useState<string | null>(null);
  const [paymentStatusLabel, setPaymentStatusLabel] = useState<string | null>(null);

  const checkoutSchema = useMemo(
    () => createOrderCheckoutFormSchema(locale),
    [locale],
  );

  const defaultValues = useMemo(
    () => createOrderCheckoutFormDefaults(orderType),
    [orderType],
  );

  const form = useForm<OrderCheckoutFormInput>({
    defaultValues,
    mode: "onBlur",
    resolver: createZodResolver<OrderCheckoutFormInput>(checkoutSchema),
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      orderType,
    });
  }, [form, orderType]);

  const watchedOrderType = useWatch({
    control: form.control,
    name: "orderType",
  });

  useEffect(() => {
    if (watchedOrderType && watchedOrderType !== orderType) {
      setOrderType(watchedOrderType);
    }
  }, [orderType, setOrderType, watchedOrderType]);

  const cartPreview = useMemo(
    () => buildCartPreviewSummary(items, menuItems, locale),
    [items, locale, menuItems],
  );

  const onSubmit = form.handleSubmit(async (rawValues) => {
    setSubmissionMessage(null);
    setSubmissionError(null);
    setPricingPreview(null);
    setOrderReference(null);
    setOrderStatusLabel(null);
    setPaymentStatusLabel(null);

    if (items.length === 0) {
      setSubmissionError(t("emptyError"));
      return;
    }

    try {
      const parsedValues = checkoutSchema.parse(rawValues);
      const response = await submitOrderCheckoutForm(parsedValues, items);

      if (!response.success) {
        setSubmissionError(response.message);
        return;
      }

      setSubmissionMessage(response.data.message ?? response.message);
      setPricingPreview(response.data.pricing_preview ?? null);
      setOrderReference(response.data.order_reference ?? null);
      setOrderStatusLabel(response.data.order_status);
      setPaymentStatusLabel(response.data.payment_status);
    } catch {
      setSubmissionError(t("submitError"));
    }
  });

  const isDelivery = watchedOrderType === "DELIVERY";

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
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

        {items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--color-border)] px-[var(--space-5)] py-[var(--space-6)]">
            <h2 className="font-serif text-2xl tracking-[0.04em]">{t("emptyTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-foreground-muted)]">
              {t("emptyDescription")}
            </p>
            <div className="mt-[var(--space-5)]">
              <Link className="button-secondary inline-flex" href="/cart">
                {t("emptyCta")}
              </Link>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-[var(--space-5)]" noValidate onSubmit={onSubmit}>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("orderTypeLabel")}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="selection-card">
                  <input className="sr-only" type="radio" value="DINE_IN" {...form.register("orderType")} />
                  <span>{t("dineInLabel")}</span>
                </label>
                <label className="selection-card">
                  <input className="sr-only" type="radio" value="DELIVERY" {...form.register("orderType")} />
                  <span>{t("deliveryLabel")}</span>
                </label>
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("paymentMethodLabel")}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="selection-card">
                  <input className="sr-only" type="radio" value="COD" {...form.register("paymentMethod")} />
                  <span>{t("codLabel")}</span>
                </label>
                <label className="selection-card">
                  <input
                    className="sr-only"
                    type="radio"
                    value="PAY_AT_RESTAURANT"
                    {...form.register("paymentMethod")}
                  />
                  <span>{t("payAtRestaurantLabel")}</span>
                </label>
              </div>
            </fieldset>

            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("nameLabel")}
                </span>
                <input className="form-control" type="text" {...form.register("customerName")} />
                {form.formState.errors.customerName ? (
                  <span className="field-error" role="alert">
                    {form.formState.errors.customerName.message}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("phoneLabel")}
                </span>
                <input className="form-control" type="tel" {...form.register("customerPhone")} />
                {form.formState.errors.customerPhone ? (
                  <span className="field-error" role="alert">
                    {form.formState.errors.customerPhone.message}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("emailLabel")}
              </span>
              <input className="form-control" type="email" {...form.register("customerEmail")} />
              {form.formState.errors.customerEmail ? (
                <span className="field-error" role="alert">
                  {form.formState.errors.customerEmail.message}
                </span>
              ) : null}
            </label>

            {isDelivery ? (
              <div className="grid gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-5)]">
                <h2 className="font-serif text-2xl tracking-[0.04em]">
                  {t("deliverySectionTitle")}
                </h2>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                    {t("addressLine1Label")}
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    {...form.register("deliveryAddressLine1")}
                  />
                  {form.formState.errors.deliveryAddressLine1 ? (
                    <span className="field-error" role="alert">
                      {form.formState.errors.deliveryAddressLine1.message}
                    </span>
                  ) : null}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                    {t("addressLine2Label")}
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    {...form.register("deliveryAddressLine2")}
                  />
                  {form.formState.errors.deliveryAddressLine2 ? (
                    <span className="field-error" role="alert">
                      {form.formState.errors.deliveryAddressLine2.message}
                    </span>
                  ) : null}
                </label>
                <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                      {t("cityLabel")}
                    </span>
                    <input className="form-control" type="text" {...form.register("deliveryCity")} />
                    {form.formState.errors.deliveryCity ? (
                      <span className="field-error" role="alert">
                        {form.formState.errors.deliveryCity.message}
                      </span>
                    ) : null}
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                      {t("postalCodeLabel")}
                    </span>
                    <input
                      className="form-control"
                      type="text"
                      {...form.register("deliveryPostalCode")}
                    />
                    {form.formState.errors.deliveryPostalCode ? (
                      <span className="field-error" role="alert">
                        {form.formState.errors.deliveryPostalCode.message}
                      </span>
                    ) : null}
                  </label>
                </div>
              </div>
            ) : null}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("specialRequestLabel")}
              </span>
              <textarea
                className="form-control min-h-28 resize-y"
                {...form.register("specialRequest")}
              />
              {form.formState.errors.specialRequest ? (
                <span className="field-error" role="alert">
                  {form.formState.errors.specialRequest.message}
                </span>
              ) : null}
            </label>

            <div className="flex flex-col gap-3">
              <button className="button-primary w-full sm:w-fit" type="submit">
                {form.formState.isSubmitting ? t("submitLoading") : t("submitCta")}
              </button>

              <div aria-live="polite" className="min-h-6 text-sm">
                {submissionMessage ? (
                  <p className="text-[color:var(--color-accent-strong)]">
                    {submissionMessage}
                  </p>
                ) : null}
                {submissionError ? (
                  <p className="field-error" role="alert">
                    {submissionError}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        )}
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)]">
        <h2 className="font-serif text-2xl tracking-[0.04em]">{t("summaryTitle")}</h2>
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
            <dt className="text-[color:var(--color-foreground-muted)]">{t("orderTypeSnapshotLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">
              {orderType === "DINE_IN" ? t("dineInLabel") : t("deliveryLabel")}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[color:var(--color-foreground-muted)]">{t("estimatedSubtotalBeforeSubmitLabel")}</dt>
            <dd className="font-medium text-[color:var(--color-foreground)]">
              {formatCurrency(cartPreview.estimatedSubtotal, locale)}
            </dd>
          </div>
        </dl>

        {cartPreview.lines.length > 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-4)]">
            <h3 className="text-sm font-medium text-[color:var(--color-foreground)]">
              {t("cartItemsTitle")}
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-7 text-[color:var(--color-foreground-muted)]">
              {cartPreview.lines.map((line, index) => (
                <li className="flex items-center justify-between gap-4" key={`${line.menuItemId}-${index}`}>
                  <span>{line.title}</span>
                  <span>{line.quantity}x</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] px-[var(--space-4)] py-[var(--space-4)] text-sm leading-7 text-[color:var(--color-foreground-soft)]">
          <p className="font-medium text-[color:var(--color-foreground)]">
            {t("estimatedTitle")}
          </p>
          <p>{t("estimatedDescription")}</p>
        </div>

        {pricingPreview ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-4)]">
            <h3 className="text-sm font-medium text-[color:var(--color-foreground)]">
              {t("responsePreviewTitle")}
            </h3>
            <dl className="mt-3 grid gap-2 text-sm leading-7">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[color:var(--color-foreground-muted)]">{t("subtotalLabel")}</dt>
                <dd className="font-medium text-[color:var(--color-foreground)]">
                  {formatCurrency(pricingPreview.subtotal, locale, pricingPreview.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[color:var(--color-foreground-muted)]">{t("estimatedTotalLabel")}</dt>
                <dd className="font-medium text-[color:var(--color-foreground)]">
                  {formatCurrency(
                    pricingPreview.estimated_total,
                    locale,
                    pricingPreview.currency,
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        {(orderReference || orderStatusLabel || paymentStatusLabel) ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] px-[var(--space-4)] py-[var(--space-4)]">
            <h3 className="text-sm font-medium text-[color:var(--color-foreground)]">
              {t("responseStatusTitle")}
            </h3>
            <dl className="mt-3 grid gap-2 text-sm leading-7">
              {orderReference ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[color:var(--color-foreground-muted)]">{t("referenceLabel")}</dt>
                  <dd className="font-medium text-[color:var(--color-foreground)]">{orderReference}</dd>
                </div>
              ) : null}
              {orderStatusLabel ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[color:var(--color-foreground-muted)]">{t("orderStatusLabel")}</dt>
                  <dd className="font-medium text-[color:var(--color-foreground)]">{orderStatusLabel}</dd>
                </div>
              ) : null}
              {paymentStatusLabel ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[color:var(--color-foreground-muted)]">{t("paymentStatusLabel")}</dt>
                  <dd className="font-medium text-[color:var(--color-foreground)]">{paymentStatusLabel}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}

        <Link className="button-secondary" href="/cart">
          {t("backToCartCta")}
        </Link>
      </aside>
    </div>
  );
}
