import type { LocalizedNavigationItem } from "@/config/navigation";
import type { ReactNode } from "react";

import { SkipToContent } from "@/components/common/SkipToContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { AppLocale } from "@/types/common.types";

type SiteShellProps = {
  children: ReactNode;
  skipToContentLabel: string;
  brandName: string;
  brandTagline: string;
  currentLocale: AppLocale;
  localeLabel: string;
  localeNames: Record<AppLocale, string>;
  navigationItems: readonly LocalizedNavigationItem[];
  navigationLabel: string;
  footerNavigationLabel: string;
  headerStatusLabel: string;
  footerTitle: string;
  footerNote: string;
  footerStatusLabel: string;
};

export function SiteShell({
  children,
  skipToContentLabel,
  brandName,
  brandTagline,
  currentLocale,
  localeLabel,
  localeNames,
  navigationItems,
  navigationLabel,
  footerNavigationLabel,
  headerStatusLabel,
  footerTitle,
  footerNote,
  footerStatusLabel,
}: SiteShellProps) {
  return (
    <div className="site-shell">
      <SkipToContent label={skipToContentLabel} />
      <SiteHeader
        brandName={brandName}
        brandTagline={brandTagline}
        currentLocale={currentLocale}
        localeLabel={localeLabel}
        localeNames={localeNames}
        navigationItems={navigationItems}
        navigationLabel={navigationLabel}
        statusLabel={headerStatusLabel}
      />
      <main className="flex-1 focus:outline-none" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter
        navigationItems={navigationItems}
        navigationLabel={footerNavigationLabel}
        note={footerNote}
        siteName={brandName}
        statusLabel={footerStatusLabel}
        title={footerTitle}
      />
    </div>
  );
}
