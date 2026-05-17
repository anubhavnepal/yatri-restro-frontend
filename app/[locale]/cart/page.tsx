import { setRequestLocale } from "next-intl/server";

import { CartShell } from "@/components/cart/CartShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getMenuItems } from "@/services/menu.service";
import type { MenuItemDTO } from "@/types/menu.types";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

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
