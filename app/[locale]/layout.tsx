import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { primaryNavigation } from "@/config/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { routing } from "@/i18n/routing";
import { buildRootMetadata } from "@/lib/metadata";
import { AppProviders } from "@/providers/app-providers";
import { resolveLocale } from "@/i18n/routing";
import type { AppLocale } from "@/types/common.types";

import "../globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(
    hasLocale(routing.locales, requestedLocale) ? requestedLocale : null,
  );

  const t = await getTranslations({ locale, namespace: "meta" });

  return buildRootMetadata({
    locale,
    siteDescription: t("siteDescription"),
    siteName: t("siteName"),
    title: t("siteName"),
    description: t("siteDescription"),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const metaT = await getTranslations({ locale, namespace: "meta" });
  const commonT = await getTranslations({ locale, namespace: "common" });
  const shellT = await getTranslations({ locale, namespace: "shell" });
  const navigationT = await getTranslations({ locale, namespace: "navigation" });
  const navigationItems = primaryNavigation.map((item) => ({
    ...item,
    label: navigationT(item.key),
  }));
  const localeNames: Record<AppLocale, string> = {
    en: commonT("localeEn"),
    ja: commonT("localeJa"),
  };

  return (
    <html
      lang={locale}
      className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppProviders>
            <SiteShell
              brandName={metaT("siteName")}
              brandTagline={shellT("brandTagline")}
              currentLocale={locale}
              footerNote={shellT("footerNote")}
              footerNavigationLabel={shellT("footerNavigationLabel")}
              footerStatusLabel={shellT("footerStatus")}
              footerTitle={shellT("footerTitle")}
              headerStatusLabel={shellT("headerStatus")}
              localeLabel={shellT("localeSwitcherLabel")}
              localeNames={localeNames}
              navigationItems={navigationItems}
              navigationLabel={shellT("primaryNavigationLabel")}
              skipToContentLabel={commonT("skipToContent")}
            >
              {children}
            </SiteShell>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
