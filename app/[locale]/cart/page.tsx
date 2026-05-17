import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CartShell } from "@/components/cart/CartShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { getMenuItems } from "@/services/menu.service";
import type { MenuItemDTO } from "@/types/menu.types";
import { resolveLocale } from "@/i18n/routing";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "CartPage",
  });
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  let menuItems: MenuItemDTO[] = [];

  try {
    const response = await getMenuItems();
    menuItems = response.success ? response.data : [];
  } catch {
    menuItems = [];
  }

  return (
    <Section spacing="default">
      <Container size="wide">
        <CartShell menuItems={menuItems} />
      </Container>
    </Section>
  );
}
