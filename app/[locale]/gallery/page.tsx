import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryShell } from "@/components/gallery/GalleryShell";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { resolveLocale } from "@/i18n/routing";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { getGalleryEntries } from "@/services/gallery.service";
import type { GalleryEntryDTO } from "@/types/cms.types";

type GalleryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "GalleryPage",
  });
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "GalleryPage" });
  let entries: GalleryEntryDTO[] = [];

  try {
    const response = await getGalleryEntries();
    entries = response.success ? response.data : [];
  } catch {
    entries = [];
  }

  return (
    <Section spacing="default">
      <Container size="wide">
        <GalleryShell
          description={t("description")}
          emptyDescription={t("emptyDescription")}
          emptyTitle={t("emptyTitle")}
          entries={entries}
          eyebrow={t("eyebrow")}
          locale={resolveLocale(locale)}
          title={t("title")}
        />
      </Container>
    </Section>
  );
}
