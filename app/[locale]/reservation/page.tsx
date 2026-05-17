import { setRequestLocale } from "next-intl/server";

import { ReservationShell } from "@/components/reservation/ReservationShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type ReservationPageProps = {
  params: Promise<{ locale: string }>;
};

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
