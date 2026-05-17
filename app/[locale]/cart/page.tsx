import { setRequestLocale } from "next-intl/server";

import { CartShell } from "@/components/cart/CartShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <Section spacing="default">
      <Container size="wide">
        <CartShell />
      </Container>
    </Section>
  );
}
