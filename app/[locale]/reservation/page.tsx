import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ReservationShell } from "@/components/reservation/ReservationShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/i18n/routing";

type ReservationPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ReservationPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "ReservationPage",
  });
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <Section spacing="default">
      <Container size="wide">
        <ReservationShell />
      </Container>
    </Section>
  );
}
