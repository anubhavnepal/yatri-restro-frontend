import { Container } from "@/components/ui/Container";

type SiteFooterProps = {
  title: string;
  note: string;
  statusLabel: string;
};

export function SiteFooter({
  title,
  note,
  statusLabel,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-[color:var(--color-border)]/80 bg-[color:var(--color-surface)]">
      <Container className="flex flex-col gap-3 py-[var(--space-6)] sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[color:var(--color-foreground)]">
            {title}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-foreground-muted)]">
            {note}
          </p>
        </div>
        <p className="text-xs tracking-[0.18em] text-[color:var(--color-foreground-soft)] uppercase">
          {statusLabel}
        </p>
      </Container>
    </footer>
  );
}
