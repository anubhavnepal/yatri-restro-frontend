'use client';

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LocalizedNavigationItem } from "@/config/navigation";
import type { AppLocale, RouteHref } from "@/types/common.types";

type SiteHeaderNavigationProps = {
  currentLocale: AppLocale;
  items: readonly LocalizedNavigationItem[];
  localeLabel: string;
  localeNames: Record<AppLocale, string>;
  navigationLabel: string;
};

function isActivePath(pathname: RouteHref, href: RouteHref) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNavigation({
  currentLocale,
  items,
  localeLabel,
  localeNames,
  navigationLabel,
}: SiteHeaderNavigationProps) {
  const pathname = usePathname() as RouteHref;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <nav aria-label={navigationLabel}>
        <ul className="flex flex-wrap gap-2.5">
          {items.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium",
                    "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
                    isActive
                      ? "border-[color:rgba(201,168,105,0.7)] bg-[color:rgba(201,168,105,0.12)] text-[color:var(--color-foreground)]"
                      : "border-[color:var(--color-border)] bg-[color:rgba(18,16,13,0.72)] text-[color:var(--color-foreground-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-foreground)]",
                  )}
                  href={item.href}
                  prefetch={item.prefetch}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label={localeLabel}
        className="flex flex-wrap items-center justify-between gap-3 sm:justify-start"
      >
        <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-foreground-soft)]">
          {localeLabel}
        </span>
        <ul className="flex flex-wrap gap-2">
          {(Object.keys(localeNames) as AppLocale[]).map((localeOption) => {
            const isCurrent = currentLocale === localeOption;

            return (
              <li key={localeOption}>
                <Link
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-3 py-2 text-sm",
                    "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
                    isCurrent
                      ? "border-[color:rgba(201,168,105,0.7)] bg-[color:rgba(201,168,105,0.12)] text-[color:var(--color-foreground)]"
                      : "border-[color:var(--color-border)] bg-transparent text-[color:var(--color-foreground-soft)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-foreground)]",
                  )}
                  href={pathname}
                  lang={localeOption}
                  locale={localeOption}
                  prefetch={false}
                >
                  {localeNames[localeOption]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
