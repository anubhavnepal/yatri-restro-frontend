'use client';

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
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
  variant: "inline" | "sticky";
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
  variant,
}: SiteHeaderNavigationProps) {
  const pathname = usePathname() as RouteHref;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "sticky") {
      return;
    }

    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 120);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, [variant]);

  const navLinks = (
    <nav aria-label={navigationLabel} className="min-w-0 xl:flex-1">
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
                    ? "border-[color:rgba(201,168,105,0.7)] bg-[color:rgba(201,168,105,0.14)] text-[color:var(--color-foreground)]"
                    : "border-[color:rgba(93,77,57,0.78)] bg-[color:rgba(18,16,13,0.58)] text-[color:var(--color-foreground-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-foreground)]",
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
  );

  const localeSwitcher = (
    <nav
      aria-label={localeLabel}
      className="flex flex-wrap items-center gap-3 xl:justify-end"
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
                    ? "border-[color:rgba(201,168,105,0.7)] bg-[color:rgba(201,168,105,0.14)] text-[color:var(--color-foreground)]"
                    : "border-[color:rgba(93,77,57,0.78)] bg-[color:rgba(18,16,13,0.22)] text-[color:var(--color-foreground-soft)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-foreground)]",
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
  );

  const navContent = (
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-5">
      {navLinks}
      {localeSwitcher}
    </div>
  );

  if (variant === "sticky") {
    return (
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[opacity,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]",
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
        )}
      >
        <Container className="pt-3">
          <div
            className={cn(
              "pointer-events-auto rounded-[var(--radius-lg)] border px-[var(--space-4)] py-3 sm:px-[var(--space-5)]",
              "sticky-nav-surface",
              isScrolled && "sticky-nav-surface--scrolled",
            )}
          >
            {navContent}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>{navContent}</div>
  );
}
