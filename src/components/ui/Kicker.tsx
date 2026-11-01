import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

/** Small uppercase label: "CHAPITRE 02 / DE LA QUESTION AU MODÈLE" */
export function Kicker({
  children,
  accent,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  accent?: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={cn("label flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {accent && <span className="text-vermilion-deep on-dark:text-vermilion-light">{accent}</span>}
      {accent && <span aria-hidden>·</span>}
      <span>{children}</span>
    </Tag>
  );
}
