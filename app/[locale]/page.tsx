import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/i18n/routing";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  return getTranslatedPageMetadata({
    locale: resolveLocale(locale),
    namespace: "HomePage",
  });
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <Section spacing="hero">
      <Container size="content">
        <div className="surface-panel motion-fade-up flex flex-col gap-6 px-[var(--space-6)] py-[var(--space-8)] text-center sm:px-[var(--space-8)] sm:py-[var(--space-10)]">
          <div className="eyebrow-cluster justify-center">
            <p className="eyebrow">{t("eyebrow")}</p>
            <span
              aria-hidden="true"
              className="h-px w-12 bg-[color:rgba(201,168,105,0.45)]"
            />
          </div>
          <h1 className="font-serif text-4xl leading-tight tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[color:var(--color-foreground-muted)] sm:text-lg">
            {t("description")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
