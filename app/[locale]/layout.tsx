import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/SiteShell";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/providers/app-providers";

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
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("siteName"),
    description: t("siteDescription"),
  };
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
              footerNote={shellT("footerNote")}
              footerStatusLabel={shellT("footerStatus")}
              footerTitle={shellT("footerTitle")}
              headerStatusLabel={shellT("headerStatus")}
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
