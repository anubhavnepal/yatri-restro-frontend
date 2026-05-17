import { cache } from "react";

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { MenuDetailShell } from "@/components/menu/MenuDetailShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { resolveLocale } from "@/i18n/routing";
import { isApiError } from "@/lib/api-error";
import { buildPageMetadata } from "@/lib/metadata";
import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import { getMenuItemBySlug } from "@/services/menu.service";
import type { MenuItemDTO } from "@/types/menu.types";

type MenuDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getMenuItemForPage = cache(async (slug: string): Promise<MenuItemDTO | null> => {
  try {
    const response = await getMenuItemBySlug(slug);

    if (!response.success) {
      if (response.statusCode === 404) {
        return null;
      }

      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) {
      return null;
    }

    throw error;
  }
});

export async function generateMetadata({
  params,
}: MenuDetailPageProps): Promise<Metadata> {
  const { locale: requestedLocale, slug } = await params;
  const locale = resolveLocale(requestedLocale);
  const item = await getMenuItemForPage(slug);

  if (!item) {
    const t = await getTranslations({ locale, namespace: "MenuPage" });

    return buildPageMetadata({
      description: t("description"),
      locale,
      title: t("title"),
    });
  }

  const description =
    getLocalizedOptionalField(item, "description", locale) ??
    (await getTranslations({ locale, namespace: "meta" }))("siteDescription");

  return buildPageMetadata({
    description,
    locale,
    title: getLocalizedField(item, "title", locale),
  });
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const item = await getMenuItemForPage(slug);

  if (!item) {
    notFound();
  }

  return (
    <Section spacing="default">
      <Container size="wide">
        <MenuDetailShell item={item} />
      </Container>
    </Section>
  );
}
