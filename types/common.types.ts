export const SUPPORTED_LOCALES = ["en", "ja"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export type RouteHref = "/" | `/${string}`;

export type CurrencyCode = "JPY";

export type Direction = "ltr";

export type ISODateString = string;

export type ISODateTimeString = string;

export type LocalizedText = {
  en: string;
  ja: string;
};
