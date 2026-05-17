import type { AppLocale, CurrencyCode } from "@/types/common.types";

export function formatCurrency(
  amount: number,
  locale: AppLocale,
  currency: CurrencyCode = "JPY",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function formatDate(
  value: Date | string,
  locale: AppLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}
