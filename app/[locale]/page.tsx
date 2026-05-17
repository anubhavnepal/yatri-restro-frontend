import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
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
      <Container size="wide">
        <div className="flex flex-col gap-[var(--space-6)]">
          <div className="grid gap-[var(--space-4)] xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.72fr)]">
            <div className="surface-panel motion-fade-up flex flex-col items-start justify-between gap-8 px-[var(--space-6)] py-[var(--space-8)] text-left sm:px-[var(--space-8)] sm:py-[var(--space-10)] xl:min-h-[32rem] xl:px-[var(--space-10)] xl:py-[var(--space-12)]">
              <div className="flex flex-col gap-6">
                <div className="eyebrow-cluster">
                  <p className="eyebrow">{t("eyebrow")}</p>
                  <span
                    aria-hidden="true"
                    className="h-px w-12 bg-[color:rgba(201,168,105,0.45)]"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="max-w-4xl font-serif text-4xl leading-tight tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-5xl xl:text-6xl">
                    {t("title")}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-[color:var(--color-foreground-muted)] sm:text-lg">
                    {t("description")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-primary" href="/menu">
                  {t("primaryCta")}
                </Link>
                <Link className="button-secondary" href="/reservation">
                  {t("secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-1">
              <div className="surface-panel flex flex-col justify-between gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] xl:min-h-[15.25rem]">
                <div className="flex flex-col gap-3">
                  <h2 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                    {t("atmosphereTitle")}
                  </h2>
                  <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                    {t("atmosphereDescription")}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:flex-col">
                  <Link className="button-secondary" href="/gallery">
                    {t("atmospherePrimaryCta")}
                  </Link>
                  <Link className="button-ghost" href="/contact">
                    {t("atmosphereSecondaryCta")}
                  </Link>
                </div>
              </div>

              <div className="surface-panel flex flex-col gap-[var(--space-4)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] xl:min-h-[15.25rem] xl:justify-end">
                <div className="eyebrow-cluster">
                  <p className="eyebrow">{t("mockModeTitle")}</p>
                  <span
                    aria-hidden="true"
                    className="h-px w-10 bg-[color:rgba(201,168,105,0.24)]"
                  />
                </div>
                <p className="text-sm leading-7 text-[color:var(--color-foreground-soft)]">
                  {t("mockModeDescription")}
                </p>
                <div>
                  <Link className="button-ghost self-start" href="/gallery">
                    {t("mockModeCta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-[var(--space-4)] lg:grid-cols-2">
            <div className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                  {t("previewTitle")}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                  {t("previewDescription")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-secondary" href="/menu">
                  {t("previewPrimaryCta")}
                </Link>
                <Link className="button-ghost" href="/cart">
                  {t("previewSecondaryCta")}
                </Link>
              </div>
            </div>

            <div className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                  {t("visitTitle")}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                  {t("visitDescription")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link className="button-secondary" href="/reservation">
                  {t("visitPrimaryCta")}
                </Link>
                <Link className="button-ghost" href="/contact">
                  {t("visitSecondaryCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
