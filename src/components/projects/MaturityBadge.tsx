"use client";

import { MATURITY_LABEL, type Maturity } from "@/types/portfolio";
import { useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";

/** Maturity, never implied by styling alone: the label is always written out. */
export function MaturityBadge({ status, dark = false }: { status: Maturity; dark?: boolean }) {
  const lang = useLang();
  const solid = status === "publie" || status === "demo";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
        dark ? "border-paper/40 text-paper" : solid ? "border-antibes bg-antibes text-paper" : "border-dashed border-antibes text-antibes",
      )}
    >
      {MATURITY_LABEL[status][lang]}
    </span>
  );
}
