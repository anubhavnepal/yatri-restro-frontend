import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { MenuShell } from "@/components/menu/MenuShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { getMenuCategories, getMenuItems } from "@/services/menu.service";
import type { MenuCategoryDTO, MenuItemDTO } from "@/types/menu.types";
import { resolveLocale } from "@/i18n/routing";

type MenuPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MenuPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "MenuPage",
  });
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  let items: MenuItemDTO[] = [];
  let categories: MenuCategoryDTO[] = [];

  try {
    const [itemsResponse, categoriesResponse] = await Promise.all([
      getMenuItems(),
      getMenuCategories(),
    ]);

    items = itemsResponse.success ? itemsResponse.data : [];
    categories = categoriesResponse.success ? categoriesResponse.data : [];
  } catch {
    items = [];
    categories = [];
  }

  return (
    <Section spacing="default">
      <Container size="wide">
        <MenuShell categories={categories} items={items} />
      </Container>
    </Section>
  );
}
