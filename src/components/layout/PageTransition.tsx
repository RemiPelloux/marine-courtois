"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Page transition for route changes only.
 * Keying on the pathname turns a navigation into an exit/enter pair, so the
 * "page" animation runs when the URL changes. `default="none"` keeps it silent
 * for every other transition — notably the Suspense reveals that stream in on
 * the initial load, which used to replay the page animation (visible jolts).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
