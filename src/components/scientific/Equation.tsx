import katex from "katex";
import { cn } from "@/lib/utils/cn";

/**
 * Server-rendered KaTeX. Only use for equations taken from the cited source
 * (notebooks or publications) — never decorative.
 */
export function Equation({
  tex,
  display = false,
  className,
  label,
}: {
  tex: string;
  display?: boolean;
  className?: string;
  /** accessible plain-language reading */
  label?: string;
}) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "htmlAndMathml" });
  return (
    <span
      className={cn(display ? "block overflow-x-auto py-1" : "inline", className)}
      aria-label={label}
      role={label ? "math" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
