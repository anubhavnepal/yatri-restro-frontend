import { defineRouting } from "next-intl/routing";

import { SUPPORTED_LOCALES, type AppLocale } from "@/types/common.types";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: "ja",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});

export const locales = routing.locales;

export const defaultLocale = routing.defaultLocale;

export const localePrefix = "always" as const;

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function resolveLocale(value?: string | null): AppLocale {
  if (value && isAppLocale(value)) {
    return value;
  }

  return routing.defaultLocale;
}
