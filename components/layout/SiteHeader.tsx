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
    <header className="border-b border-[color:var(--color-border)]/80 bg-[color:var(--color-background)]/95 supports-[backdrop-filter]:bg-[color:rgba(10,9,7,0.88)] supports-[backdrop-filter]:backdrop-blur-md">
      <Container className="flex flex-col gap-4 py-[var(--space-4)]">
        <div className="flex min-h-20 items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href="/"
              className={cn(
                "font-serif text-lg tracking-[0.14em] text-[color:var(--color-foreground)] uppercase",
                "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
                "hover:text-[color:var(--color-accent)]",
              )}
            >
              {brandName}
            </Link>
            <p className="text-xs tracking-[0.22em] text-[color:var(--color-foreground-soft)] uppercase">
              {brandTagline}
            </p>
          </div>
          <p className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-[0.68rem] font-medium tracking-[0.2em] text-[color:var(--color-foreground-muted)] uppercase">
            {statusLabel}
          </p>
        </div>
        <SiteHeaderNavigation
          currentLocale={currentLocale}
          items={navigationItems}
          localeLabel={localeLabel}
          localeNames={localeNames}
          navigationLabel={navigationLabel}
        />
      </Container>
    </header>
  );
}
