"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/researcher";
import { frenchPath } from "@/i18n/paths";

export type NavItem = (typeof NAV_ITEMS)[number];

/** True when the current page belongs to the nav entry (in either language). */
export function useIsActive() {
  const pathname = frenchPath(usePathname());
  return (item: NavItem) => item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}
