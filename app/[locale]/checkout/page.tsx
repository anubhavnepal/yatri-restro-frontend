import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CheckoutShell } from "@/components/order/CheckoutShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { getMenuItems } from "@/services/menu.service";
import type { MenuItemDTO } from "@/types/menu.types";
import { resolveLocale } from "@/i18n/routing";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;

  const metadata = await getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "CheckoutPage",
  });

  return {
    ...metadata,
    robots: {
      follow: false,
      index: false,
    },
  };
}

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
