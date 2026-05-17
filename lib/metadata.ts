import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import type { AppLocale } from "@/types/common.types";

const openGraphLocaleMap: Record<AppLocale, string> = {
  en: "en_US",
  ja: "ja_JP",
};

type LocalizedMetadataInput = {
  locale: AppLocale;
  title: string;
  description: string;
};

export function buildRootMetadata({
  locale,
  siteName,
  siteDescription,
}: LocalizedMetadataInput & {
  siteName: string;
  siteDescription: string;
}): Metadata {
  return {
    applicationName: siteName,
    category: "restaurant",
    description: siteDescription,
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    openGraph: {
      description: siteDescription,
      locale: openGraphLocaleMap[locale],
      siteName,
      title: siteName,
      type: "website",
    },
    robots: {
      follow: true,
      index: true,
    },
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    twitter: {
      card: "summary_large_image",
      description: siteDescription,
      title: siteName,
    },
  };
}

export function buildPageMetadata({
  locale,
  title,
  description,
}: LocalizedMetadataInput): Metadata {
  return {
    description,
    openGraph: {
      description,
      locale: openGraphLocaleMap[locale],
      siteName: siteConfig.name,
      title,
      type: "website",
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export async function getTranslatedPageMetadata({
  locale,
  namespace,
}: {
  locale: AppLocale;
  namespace: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  return buildPageMetadata({
    description: t("description"),
    locale,
    title: t("title"),
  });
}
