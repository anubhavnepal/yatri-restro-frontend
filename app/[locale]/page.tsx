import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <Section spacing="hero">
      <Container size="content">
        <div className="surface-panel motion-fade-up flex flex-col gap-5 px-[var(--space-6)] py-[var(--space-8)] text-center sm:px-[var(--space-8)] sm:py-[var(--space-10)]">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl leading-tight tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-base leading-8 text-[color:var(--color-foreground-muted)] sm:text-lg">
            {t("description")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
