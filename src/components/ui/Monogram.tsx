import { RESEARCHER } from "@/data/researcher";
import { cn } from "@/lib/utils/cn";

/** Typographic monogram: overlapping serif M and C with a accent full stop. */
export function Monogram({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 64 44" className={cn("shrink-0", className)} role="img" aria-label={RESEARCHER.monogram}>
      <text x="0" y="36" fontFamily="var(--font-serif)" fontSize="46" fill={inverted ? "#f5f2eb" : "#0f1d2e"}>
        M
      </text>
      <text x="25" y="41" fontFamily="var(--font-serif)" fontSize="44" fill={inverted ? "#f5f2eb" : "#0f1d2e"}>
        C
      </text>
      <circle cx="58.5" cy="38" r="3" fill={inverted ? "#6fb3f2" : "#2468b3"} />
    </svg>
  );
}
