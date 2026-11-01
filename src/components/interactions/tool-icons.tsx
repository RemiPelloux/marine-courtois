import { siGitlab, siJupyter, siMysql, siNumpy, siPandas, siPython, siR, siScipy, siSympy } from "simple-icons";
import type { ReactNode } from "react";

/** Brand marks from Simple Icons (CC0) for the tools that publish one. */
const BRANDS: Record<string, { path: string; hex: string }> = {
  python: siPython,
  jupyter: siJupyter,
  numpy: siNumpy,
  scipy: siScipy,
  sympy: siSympy,
  pandas: siPandas,
  gitlab: siGitlab,
  r: siR,
  mysql: siMysql,
};

/**
 * Neutral pictograms for tools without an open logo — they show what the tool
 * does, they do not imitate a trademark.
 */
const GLYPHS: Record<string, ReactNode> = {
  matplotlib: (
    <>
      <path d="M3 3v18h18" />
      <path d="M6 16c2.5-9 5-9 7-3s4 3 7-7" />
    </>
  ),
  seaborn: (
    <>
      <path d="M2 20c3 0 4-12 7-12s4 12 7 12" />
      <path d="M8 20c3 0 4-8 6.5-8S18 20 22 20" opacity=".6" />
    </>
  ),
  statsmodels: (
    <>
      <path d="M3 3v18h18" />
      <path d="M5 18 20 6" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12.5" r="1.2" fill="currentColor" />
      <circle cx="14" cy="8" r="1.2" fill="currentColor" />
      <circle cx="17" cy="10" r="1.2" fill="currentColor" />
    </>
  ),
  mesa: (
    <>
      {[5, 12, 19].flatMap((x) =>
        [5, 12, 19].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 12 && y === 12 ? 2.6 : 1.8} fill={x + y === 24 ? "currentColor" : "none"} />),
      )}
    </>
  ),
  "python-control": <path d="M12 12c0-1 1-2 2-1.5s1 2.5-.5 3.5-4 .5-4.5-1.5 1-5 4-5 5.5 2 5.5 5-3 7-7 7-8-3-8-8 4-9 9-9" />,
  "r-shiny": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 8h18" />
      <path d="M7 17v-4M11 17v-6M15 17v-3" />
    </>
  ),
  "power-bi": <path d="M5 20V12M10 20V7M15 20V10M20 20V4" strokeWidth="2.6" />,
};

export function hasBrand(id: string) {
  return id in BRANDS;
}

export function brandHex(id: string) {
  return BRANDS[id] ? `#${BRANDS[id].hex}` : undefined;
}

/** 24×24 icon for a tool: brand mark if available, pictogram otherwise. */
export function ToolIcon({ id, className }: { id: string; className?: string }) {
  const brand = BRANDS[id];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <path d={brand.path} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[id] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
