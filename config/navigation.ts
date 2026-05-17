import type { RouteHref } from "@/types/common.types";

export type NavigationKey =
  | "home"
  | "menu"
  | "reservation"
  | "gallery"
  | "contact"
  | "cart";

export type NavigationItem = {
  key: NavigationKey;
  href: RouteHref;
  prefetch?: boolean;
};

export const primaryNavigation: readonly NavigationItem[] = [
  { key: "home", href: "/" },
  { key: "menu", href: "/menu" },
  { key: "reservation", href: "/reservation" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
  { key: "cart", href: "/cart", prefetch: false },
] as const;

export const footerNavigation: readonly NavigationItem[] = primaryNavigation;
