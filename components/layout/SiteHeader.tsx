import type { LocalizedNavigationItem } from "@/config/navigation";
import { SiteHeaderNavigation } from "@/components/layout/SiteHeaderNavigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import type { AppLocale } from "@/types/common.types";

type SiteHeaderProps = {
  brandName: string;
  brandTagline: string;
  currentLocale: AppLocale;
  localeLabel: string;
  localeNames: Record<AppLocale, string>;
  navigationItems: readonly LocalizedNavigationItem[];
  navigationLabel: string;
  statusLabel: string;
};

export function SiteHeader({
  brandName,
  brandTagline,
  currentLocale,
  localeLabel,
  localeNames,
  navigationItems,
  navigationLabel,
  statusLabel,
}: SiteHeaderProps) {
  return (
    <>
      <header className="relative border-b border-[color:var(--color-border)]/70 bg-[color:var(--color-background)]">
        <Container className="py-[var(--space-5)] sm:py-[var(--space-6)]">
          <div className="header-composition surface-panel">
            <div className="flex flex-col gap-3 px-[var(--space-4)] pt-[var(--space-4)] pb-[var(--space-3)] sm:px-[var(--space-5)] sm:pt-[var(--space-5)] sm:pb-[var(--space-4)] lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-col gap-1">
                <Link
                  href="/"
                  className={cn(
                    "font-serif text-base tracking-[0.14em] text-[color:var(--color-foreground)] uppercase sm:text-lg",
                    "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
                    "hover:text-[color:var(--color-accent)]",
                  )}
                >
                  {brandName}
                </Link>
                <p className="max-w-2xl text-[0.68rem] leading-6 tracking-[0.2em] text-[color:var(--color-foreground-soft)] uppercase sm:text-xs">
                  {brandTagline}
                </p>
              </div>
              <p className="self-start rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-[0.68rem] font-medium tracking-[0.2em] text-[color:var(--color-foreground-muted)] uppercase lg:self-auto">
                {statusLabel}
              </p>
            </div>

            <div className="header-nav-row px-[var(--space-4)] pb-[var(--space-4)] sm:px-[var(--space-5)] sm:pb-[var(--space-5)]">
              <SiteHeaderNavigation
                currentLocale={currentLocale}
                items={navigationItems}
                localeLabel={localeLabel}
                localeNames={localeNames}
                navigationLabel={navigationLabel}
                variant="inline"
              />
            </div>
          </div>
        </Container>
      </header>

      <SiteHeaderNavigation
        currentLocale={currentLocale}
        items={navigationItems}
        localeLabel={localeLabel}
        localeNames={localeNames}
        navigationLabel={navigationLabel}
        variant="sticky"
      />
    </>
  );
}
