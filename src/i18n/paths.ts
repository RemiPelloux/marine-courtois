import { DEFAULT_LANG, type Lang } from "./config";

/**
 * Routes are written in French inside the app (`/recherche/x`). English pages
 * are served under /en with translated first segments (`/en/research/x`).
 * Content slugs (publications, projects, themes) are shared by both languages.
 */
const EN_SEGMENT: Record<string, string> = {
  parcours: "career",
  recherche: "research",
  communications: "talks",
  vulgarisation: "outreach",
  enseignement: "teaching",
  projets: "projects",
  outils: "tools",
  these: "thesis",
  laboratoire: "lab",
};
const FR_SEGMENT: Record<string, string> = Object.fromEntries(Object.entries(EN_SEGMENT).map(([fr, en]) => [en, fr]));

/** Splits "/a/b?x#y" into the path and its "?x#y" tail. */
function splitTail(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

function mapFirst(path: string, table: Record<string, string>): string {
  const [, first = "", ...rest] = path.split("/");
  const mapped = table[first] ?? first;
  return "/" + [mapped, ...rest].join("/");
}

/** Public URL of an internal French path in a language: ("/recherche/x", "en") → "/en/research/x". */
export function localePath(lang: Lang, href: string): string {
  if (!href.startsWith("/") || lang === DEFAULT_LANG) return href;
  const [path, tail] = splitTail(href);
  const mapped = path === "/" ? "" : mapFirst(path, EN_SEGMENT);
  return `/en${mapped}${tail}` || "/en";
}

/** Language of a public pathname. */
export function langOf(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/**
 * Internal French path of a pathname: "/en/research/x" → "/recherche/x", "/recherche" → "/recherche".
 * Also accepts the rewritten route ("/fr/recherche", "/en/recherche"), which is what
 * usePathname() returns while a page is prerendered on the server.
 */
export function frenchPath(pathname: string): string {
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return pathname.slice(3) || "/";
  if (langOf(pathname) === "fr") return pathname;
  const rest = pathname.slice(3) || "/";
  return rest === "/" ? "/" : mapFirst(rest, FR_SEGMENT);
}

/** Route the app renders for a public pathname: "/en/research" → "/en/recherche", "/recherche" → "/fr/recherche". */
export function internalPath(pathname: string): string {
  const lang = langOf(pathname);
  const fr = frenchPath(pathname);
  return `/${lang}${fr === "/" ? "" : fr}`;
}

/** True when an English URL uses a French segment that has an English name ("/en/recherche"). */
export function hasUntranslatedSegment(pathname: string): boolean {
  if (langOf(pathname) !== "en") return false;
  const first = pathname.split("/")[2] ?? "";
  return first in EN_SEGMENT;
}

/** The same page in the other language. */
export function switchPath(pathname: string, to: Lang): string {
  return localePath(to, frenchPath(pathname));
}
