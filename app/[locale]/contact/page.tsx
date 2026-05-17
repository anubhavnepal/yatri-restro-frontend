import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ContactShell } from "@/components/forms/ContactShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/i18n/routing";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "ContactPage",
  });
}

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
