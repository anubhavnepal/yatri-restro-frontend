import { defaultLocale, locales } from "@/i18n/routing";
import type { AppLocale, CurrencyCode } from "@/types/common.types";

export type SiteConfig = {
  name: string;
  shortName: string;
  description: string;
  defaultLocale: AppLocale;
  locales: readonly AppLocale[];
  currency: CurrencyCode;
  timeZone: string;
  apiBaseEnvVar: "NEXT_PUBLIC_API_URL";
};

export const siteConfig: SiteConfig = {
  name: "Yatri Restro",
  shortName: "Yatri",
  description: "Premium Nepali dining experience in Japan.",
  defaultLocale,
  locales,
  currency: "JPY",
  timeZone: "Asia/Tokyo",
  apiBaseEnvVar: "NEXT_PUBLIC_API_URL",
};
