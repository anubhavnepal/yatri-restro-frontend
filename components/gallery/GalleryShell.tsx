import Image from "next/image";

import { getLocalizedField, getLocalizedOptionalField } from "@/lib/localization";
import type { GalleryEntryDTO } from "@/types/cms.types";
import type { AppLocale } from "@/types/common.types";

type GalleryShellProps = {
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  entries: GalleryEntryDTO[];
  eyebrow: string;
  locale: AppLocale;
  title: string;
};

export function GalleryShell({
  description,
  emptyDescription,
  emptyTitle,
  entries,
  eyebrow,
  locale,
  title,
}: GalleryShellProps) {
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="surface-panel flex flex-col gap-3 px-[var(--space-5)] py-[var(--space-6)] text-center sm:px-[var(--space-6)]">
          <h2 className="font-serif text-2xl tracking-[0.04em]">{emptyTitle}</h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)]">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
          {entries.map((entry, index) => {
            const titleText = getLocalizedField(entry, "title", locale);
            const descriptionText = getLocalizedOptionalField(
              entry,
              "description",
              locale,
            );
            const imageAlt =
              getLocalizedOptionalField(entry.image, "alt", locale) ?? titleText;
            const caption = getLocalizedOptionalField(
              entry.image,
              "caption",
              locale,
            );

            return (
              <figure
                className="surface-panel overflow-hidden"
                key={entry.id}
              >
                <div className="relative aspect-[4/3] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                  <Image
                    alt={imageAlt}
                    className="object-cover"
                    fill
                    preload={index === 0}
                    sizes="(min-width: 1280px) 36rem, (min-width: 640px) 50vw, 100vw"
                    src={entry.image.url}
                  />
                </div>
                <figcaption className="flex flex-col gap-4 px-[var(--space-5)] py-[var(--space-5)] sm:px-[var(--space-6)]">
                  <h2 className="font-serif text-2xl tracking-[0.04em]">
                    {titleText}
                  </h2>
                  {descriptionText ? (
                    <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
                      {descriptionText}
                    </p>
                  ) : null}
                  {caption ? (
                    <p className="border-t border-[color:rgba(93,77,57,0.64)] pt-3 text-sm leading-7 text-[color:var(--color-foreground-soft)]">
                      {caption}
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
