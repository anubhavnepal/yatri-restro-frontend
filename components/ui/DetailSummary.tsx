import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DetailSummaryItem = {
  label: string;
  value: ReactNode;
};

type DetailSummaryProps = {
  className?: string;
  items: DetailSummaryItem[];
};

export function DetailSummary({ className, items }: DetailSummaryProps) {
  return (
    <dl className={cn("detail-list", className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
