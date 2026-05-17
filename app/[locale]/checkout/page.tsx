import { setRequestLocale } from "next-intl/server";

import { CheckoutShell } from "@/components/order/CheckoutShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <Section spacing="default">
      <Container size="wide">
        <CheckoutShell />
      </Container>
    </Section>
  );
}
