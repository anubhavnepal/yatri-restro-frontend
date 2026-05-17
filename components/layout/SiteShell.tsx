import type { ReactNode } from "react";

import { SkipToContent } from "@/components/common/SkipToContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type SiteShellProps = {
  children: ReactNode;
  skipToContentLabel: string;
  brandName: string;
  brandTagline: string;
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
        statusLabel={headerStatusLabel}
      />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <SiteFooter
        note={footerNote}
        statusLabel={footerStatusLabel}
        title={footerTitle}
      />
    </div>
  );
}
