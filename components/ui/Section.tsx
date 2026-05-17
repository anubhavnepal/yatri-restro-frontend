import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionSpacing = "compact" | "default" | "hero";

type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  spacing?: SectionSpacing;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const spacingClasses: Record<SectionSpacing, string> = {
  compact: "py-[var(--section-space-compact)]",
  default: "py-[var(--section-space-default)]",
  hero: "py-[var(--section-space-hero)]",
};

export function Section<T extends ElementType = "section">({
  as,
  children,
  className,
  spacing = "default",
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";

  return (
    <Component className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </Component>
  );
}
