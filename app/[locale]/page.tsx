import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeFeaturedAddToCartButton } from "@/components/sections/home/HomeFeaturedAddToCartButton";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/routing";
import { formatCurrency } from "@/lib/formatters";
import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import { getTranslatedPageMetadata } from "@/lib/metadata";
import { getGalleryEntries } from "@/services/gallery.service";
import { getMenuItems } from "@/services/menu.service";
import type { AppLocale } from "@/types/common.types";
import type { GalleryEntryDTO } from "@/types/cms.types";
import type { MenuItemDTO } from "@/types/menu.types";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

type HeroVisualCard = {
  alt: string;
  description?: string;
  id: string;
  imageUrl: string;
  subtitle: string;
  title: string;
};

function uniqueMenuItems(items: MenuItemDTO[]): MenuItemDTO[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function selectHomepageItems(items: MenuItemDTO[], count = 3): MenuItemDTO[] {
  const featured = items.filter((item) => item.is_featured);
  const remaining = items.filter((item) => !item.is_featured);

  return uniqueMenuItems([...featured, ...remaining]).slice(0, count);
}

function getCategoryTitle(item: MenuItemDTO, locale: AppLocale): string {
  return typeof item.category === "string"
    ? item.category
    : getLocalizedField(item.category, "title", locale);
}

function getMenuImageAlt(item: MenuItemDTO, locale: AppLocale): string {
  return (
    getLocalizedOptionalField(item.image ?? {}, "alt", locale) ??
    getLocalizedOptionalField(item.image ?? {}, "caption", locale) ??
    getLocalizedField(item, "title", locale)
  );
}

function getGalleryImageAlt(entry: GalleryEntryDTO, locale: AppLocale): string {
  return (
    getLocalizedOptionalField(entry.image, "alt", locale) ??
    getLocalizedOptionalField(entry.image, "caption", locale) ??
    getLocalizedField(entry, "title", locale)
  );
}

function buildHeroCards(
  locale: AppLocale,
  menuItems: MenuItemDTO[],
  signatureItems: MenuItemDTO[],
  galleryEntries: GalleryEntryDTO[],
  fallbackSubtitle: string,
): HeroVisualCard[] {
  const menuCards = uniqueMenuItems([...signatureItems, ...menuItems])
    .filter((item) => item.image?.url)
    .map((item) => ({
      alt: getMenuImageAlt(item, locale),
      description: getLocalizedOptionalField(item, "description", locale) ?? undefined,
      id: item.id,
      imageUrl: item.image!.url,
      subtitle: getCategoryTitle(item, locale),
      title: getLocalizedField(item, "title", locale),
    }));

  const galleryCards = galleryEntries
    .filter((entry) => entry.image?.url)
    .map((entry) => ({
      alt: getGalleryImageAlt(entry, locale),
      description: getLocalizedOptionalField(entry, "description", locale) ?? undefined,
      id: `gallery-${entry.id}`,
      imageUrl: entry.image.url,
      subtitle: fallbackSubtitle,
      title: getLocalizedField(entry, "title", locale),
    }));

  return [...menuCards, ...galleryCards].slice(0, 3);
}

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
  const resolvedLocale = resolveLocale(locale);

  setRequestLocale(resolvedLocale);

  const t = await getTranslations({ locale: resolvedLocale, namespace: "HomePage" });
  const [menuResponse, galleryResponse] = await Promise.all([
    getMenuItems(),
    getGalleryEntries(),
  ]);

  const menuItems = menuResponse.data ?? [];
  const galleryEntries = galleryResponse.data ?? [];
  const signatureItems = selectHomepageItems(menuItems, 3);
  const recommendation =
    signatureItems.find((item) => item.is_featured) ?? signatureItems[0] ?? null;
  const heroCards = buildHeroCards(
    resolvedLocale,
    menuItems,
    signatureItems,
    galleryEntries,
    t("galleryEyebrow"),
  );
  const [heroLeadCard, ...heroSupportingCards] = heroCards;
  const galleryPreview = galleryEntries.slice(0, 3);

  return (
    <>
      <Section aria-labelledby="home-hero-title" spacing="hero">
        <Container size="wide">
          <div className="grid gap-[var(--space-6)] xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-stretch">
            <div className="surface-panel motion-fade-up relative overflow-hidden px-[var(--space-6)] py-[var(--space-8)] sm:px-[var(--space-8)] sm:py-[var(--space-10)] xl:px-[var(--space-10)] xl:py-[var(--space-12)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,105,0.18),transparent_42%),linear-gradient(180deg,rgba(38,32,24,0.28),transparent_52%)]"
              />
              <div className="relative flex h-full flex-col gap-[var(--space-8)] xl:justify-between">
                <div className="flex flex-col gap-[var(--space-6)]">
                  <div className="eyebrow-cluster">
                    <p className="eyebrow">{t("eyebrow")}</p>
                    <span
                      aria-hidden="true"
                      className="h-px w-14 bg-[color:rgba(201,168,105,0.48)]"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <h1
                      className="max-w-4xl font-serif text-4xl leading-[1.08] tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-5xl xl:text-6xl"
                      id="home-hero-title"
                    >
                      {t("title")}
                    </h1>
                    <p className="max-w-3xl text-base leading-8 text-[color:var(--color-foreground-muted)] sm:text-lg">
                      {t("description")}
                    </p>
                  </div>

                  <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-soft)] sm:text-base">
                    {t("heroNote")}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Link className="button-primary" href="/menu">
                    {t("primaryCta")}
                  </Link>
                  <Link className="button-secondary" href="/reservation">
                    {t("secondaryCta")}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-[var(--space-4)] sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:min-h-full">
              {heroLeadCard ? (
                <article className="surface-panel overflow-hidden sm:row-span-2">
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] xl:h-full xl:min-h-[34rem] xl:aspect-auto">
                    <Image
                      alt={heroLeadCard.alt}
                      className="object-cover"
                      fill
                      preload
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 54vw, 100vw"
                      src={heroLeadCard.imageUrl}
                    />
                  </div>
                  <div className="flex flex-col gap-3 px-[var(--space-5)] py-[var(--space-5)] sm:px-[var(--space-6)] sm:py-[var(--space-6)]">
                    <p className="eyebrow">{heroLeadCard.subtitle}</p>
                    <h2 className="font-serif text-3xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                      {heroLeadCard.title}
                    </h2>
                    <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                      {heroLeadCard.description ?? t("heroVisualDescription")}
                    </p>
                  </div>
                </article>
              ) : null}

              {heroSupportingCards.map((card) => (
                <article className="surface-panel overflow-hidden" key={card.id}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      alt={card.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1280px) 16vw, (min-width: 640px) 40vw, 100vw"
                      src={card.imageUrl}
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-[var(--space-4)] py-[var(--space-4)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                      {card.subtitle}
                    </p>
                    <h2 className="font-serif text-xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                      {card.title}
                    </h2>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="home-signature-title" spacing="default">
        <Container size="wide">
          <div className="flex flex-col gap-[var(--space-6)]">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">{t("featuredEyebrow")}</p>
              <h2
                className="max-w-3xl font-serif text-3xl tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-4xl"
                id="home-signature-title"
              >
                {t("featuredTitle")}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                {t("featuredDescription")}
              </p>
            </div>

            <div className="grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-3">
              {signatureItems.map((item) => {
                const title = getLocalizedField(item, "title", resolvedLocale);
                const description = getLocalizedOptionalField(item, "description", resolvedLocale);
                const categoryTitle = getCategoryTitle(item, resolvedLocale);

                return (
                  <article className="surface-panel overflow-hidden" key={item.id}>
                    {item.image ? (
                      <div className="relative aspect-[4/3]">
                        <Image
                          alt={getMenuImageAlt(item, resolvedLocale)}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"
                          src={item.image.url}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-[color:var(--color-surface-muted)] px-[var(--space-4)] text-sm text-[color:var(--color-foreground-soft)]">
                        {categoryTitle}
                      </div>
                    )}

                    <div className="flex h-full flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-5)] sm:px-[var(--space-6)] sm:py-[var(--space-6)]">
                      <div className="flex flex-col gap-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                          {categoryTitle}
                        </p>
                        <h3 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                          {title}
                        </h3>
                        {description ? (
                          <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                            {description}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-auto flex flex-col gap-4">
                        <div className="divider-top flex items-end justify-between gap-4 pt-[var(--space-4)]">
                          <div className="min-w-0">
                            <p className="text-sm text-[color:var(--color-foreground-soft)]">
                              {t("startingFromLabel")}
                            </p>
                            <p className="text-2xl font-medium text-[color:var(--color-foreground)]">
                              {formatCurrency(item.price, resolvedLocale)}
                            </p>
                          </div>
                          <Link
                            className="button-ghost self-end"
                            href={`/menu/${item.slug}`}
                            prefetch={false}
                          >
                            {t("featuredItemCta")}
                          </Link>
                        </div>

                        <HomeFeaturedAddToCartButton
                          defaultVariantId={item.variants?.find((variant) => variant.is_default)?.id}
                          isAvailable={item.is_available}
                          menuItemId={item.id}
                          unavailableLabel={t("featuredUnavailableCta")}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {recommendation ? (
        <Section aria-labelledby="home-recommendation-title" spacing="compact">
          <Container size="wide">
            <div className="surface-panel overflow-hidden">
              <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                {recommendation.image ? (
                  <div className="relative min-h-[18rem] lg:min-h-[34rem]">
                    <Image
                      alt={getMenuImageAlt(recommendation, resolvedLocale)}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      src={recommendation.image.url}
                    />
                  </div>
                ) : null}

                <div className="flex flex-col justify-center gap-[var(--space-6)] px-[var(--space-6)] py-[var(--space-8)] sm:px-[var(--space-8)] xl:px-[var(--space-10)] xl:py-[var(--space-10)]">
                  <div className="flex flex-col gap-3">
                    <p className="eyebrow">{t("chefEyebrow")}</p>
                    <h2
                      className="font-serif text-3xl tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-4xl"
                      id="home-recommendation-title"
                    >
                      {getLocalizedField(recommendation, "title", resolvedLocale)}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                      {getLocalizedOptionalField(recommendation, "description", resolvedLocale) ??
                        t("chefDescription")}
                    </p>
                  </div>

                  <div className="section-card gap-3">
                    <p className="text-sm text-[color:var(--color-foreground-soft)]">
                      {t("startingFromLabel")}
                    </p>
                    <p className="text-3xl font-medium text-[color:var(--color-foreground)]">
                      {formatCurrency(recommendation.price, resolvedLocale)}
                    </p>
                    <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                      {t("chefPriceNote")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      className="button-primary"
                      href={`/menu/${recommendation.slug}`}
                      prefetch={false}
                    >
                      {t("chefPrimaryCta")}
                    </Link>
                    <Link className="button-secondary" href="/menu">
                      {t("chefSecondaryCta")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section aria-labelledby="home-reservation-title" spacing="compact">
        <Container size="wide">
          <div className="surface-panel relative overflow-hidden px-[var(--space-6)] py-[var(--space-8)] sm:px-[var(--space-8)] sm:py-[var(--space-10)] xl:px-[var(--space-10)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,105,0.14),transparent_34%)]"
            />
            <div className="relative grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
              <div className="flex flex-col gap-[var(--space-5)]">
                <div className="flex flex-col gap-3">
                  <p className="eyebrow">{t("reservationEyebrow")}</p>
                  <h2
                    className="max-w-3xl font-serif text-3xl tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-4xl"
                    id="home-reservation-title"
                  >
                    {t("reservationTitle")}
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                    {t("reservationDescription")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link className="button-primary" href="/reservation">
                    {t("reservationPrimaryCta")}
                  </Link>
                  <Link className="button-secondary" href="/contact">
                    {t("reservationSecondaryCta")}
                  </Link>
                </div>
              </div>

              <div className="section-card gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                  {t("reservationEyebrow")}
                </p>
                <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                  {t("reservationNote")}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {galleryPreview.length ? (
        <Section aria-labelledby="home-gallery-title" spacing="default">
          <Container size="wide">
            <div className="flex flex-col gap-[var(--space-6)]">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">{t("galleryEyebrow")}</p>
                <h2
                  className="max-w-3xl font-serif text-3xl tracking-[0.04em] text-[color:var(--color-foreground)] sm:text-4xl"
                  id="home-gallery-title"
                >
                  {t("galleryTitle")}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
                  {t("galleryDescription")}
                </p>
              </div>

              <div className="grid gap-[var(--space-4)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                {galleryPreview[0] ? (
                  <article className="surface-panel overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        alt={getGalleryImageAlt(galleryPreview[0], resolvedLocale)}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        src={galleryPreview[0].image.url}
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-[var(--space-5)] py-[var(--space-5)]">
                      <h3 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                        {getLocalizedField(galleryPreview[0], "title", resolvedLocale)}
                      </h3>
                      {getLocalizedOptionalField(galleryPreview[0], "description", resolvedLocale) ? (
                        <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                          {getLocalizedOptionalField(galleryPreview[0], "description", resolvedLocale)}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ) : null}

                <div className="grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-1">
                  {galleryPreview.slice(1, 3).map((entry) => (
                    <article className="surface-panel overflow-hidden" key={entry.id}>
                      <div className="relative aspect-[4/3]">
                        <Image
                          alt={getGalleryImageAlt(entry, resolvedLocale)}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 100vw"
                          src={entry.image.url}
                        />
                      </div>
                      <div className="flex flex-col gap-2 px-[var(--space-4)] py-[var(--space-4)]">
                        <h3 className="font-serif text-xl tracking-[0.04em] text-[color:var(--color-foreground)]">
                          {getLocalizedField(entry, "title", resolvedLocale)}
                        </h3>
                        {getLocalizedOptionalField(entry, "description", resolvedLocale) ? (
                          <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                            {getLocalizedOptionalField(entry, "description", resolvedLocale)}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <Link className="button-secondary" href="/gallery">
                  {t("galleryCta")}
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section spacing="compact">
        <Container size="wide">
          <div className="support-note">
            <p className="support-note-title">{t("previewNoteTitle")}</p>
            <p>{t("previewNoteDescription")}</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
