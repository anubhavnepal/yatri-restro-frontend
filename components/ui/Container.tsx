import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerSize = "default" | "content" | "wide";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const sizeClasses: Record<ContainerSize, string> = {
  default: "max-w-6xl",
  content: "max-w-3xl",
  wide: "max-w-7xl",
};

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  size = "default",
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
