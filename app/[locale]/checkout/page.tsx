import { setRequestLocale } from "next-intl/server";

import { CheckoutShell } from "@/components/order/CheckoutShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getMenuItems } from "@/services/menu.service";
import type { MenuItemDTO } from "@/types/menu.types";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
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
        <CheckoutShell menuItems={menuItems} />
      </Container>
    </Section>
  );
}
