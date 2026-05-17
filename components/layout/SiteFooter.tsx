import type { LocalizedNavigationItem } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

type SiteFooterProps = {
  navigationItems: readonly LocalizedNavigationItem[];
  navigationLabel: string;
  siteName: string;
  title: string;
  note: string;
  statusLabel: string;
};

export function SiteFooter({
  navigationItems,
  navigationLabel,
  siteName,
  title,
  note,
  statusLabel,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-[color:var(--color-border)]/80 bg-[color:var(--color-surface)]">
      <Container className="grid gap-[var(--space-5)] py-[var(--space-6)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-[color:var(--color-foreground)]">
              {title}
            </p>
            <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-foreground-muted)]">
              {note}
            </p>
          </div>
          <nav aria-label={navigationLabel}>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-[color:var(--color-foreground-soft)] transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] hover:text-[color:var(--color-foreground)]"
                    href={item.href}
                    prefetch={item.prefetch}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-xs tracking-[0.18em] text-[color:var(--color-foreground-soft)] uppercase lg:items-end">
          <p>{statusLabel}</p>
          <p>{siteName}</p>
        </div>
      </Container>
    </footer>
  );
}
