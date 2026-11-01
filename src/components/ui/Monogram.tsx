import { a11y } from "@/i18n";
import { cn } from "@/lib/utils/cn";

/** Typographic monogram: overlapping serif M and C with a vermilion full stop. */
export function Monogram({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 64 44" className={cn("shrink-0", className)} role="img" aria-label={a11y.monogram}>
      <text x="0" y="36" fontFamily="var(--font-serif)" fontSize="46" fill={inverted ? "#f5f2eb" : "#171b18"}>
        M
      </text>
      <text x="25" y="41" fontFamily="var(--font-serif)" fontSize="44" fill={inverted ? "#f5f2eb" : "#171b18"}>
        C
      </text>
      <circle cx="58.5" cy="38" r="3" fill="#f04a2d" />
    </svg>
  );
}
