import { setRequestLocale } from "next-intl/server";

import { ContactShell } from "@/components/forms/ContactShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <Section spacing="default">
      <Container size="wide">
        <ContactShell />
      </Container>
    </Section>
  );
}
