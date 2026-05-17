import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

type SiteHeaderProps = {
  brandName: string;
  brandTagline: string;
  statusLabel: string;
};

export function SiteHeader({
  brandName,
  brandTagline,
  statusLabel,
}: SiteHeaderProps) {
  return (
    <header className="border-b border-[color:var(--color-border)]/80 bg-[color:var(--color-background)]/95">
      <Container className="flex min-h-20 items-center justify-between gap-6 py-[var(--space-4)]">
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
      </Container>
    </header>
  );
}
