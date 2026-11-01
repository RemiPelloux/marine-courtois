import type { MetadataRoute } from "next";
import { LANGS, type Lang } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { RESEARCHER } from "@/data/researcher";
import { PUBLICATIONS } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";
import { PUBLIC_PROJECTS } from "@/data/projects";

type Entry = { path: string; changeFrequency: "monthly" | "yearly"; priority: number };

const STATIC_PATHS = ["/", "/parcours", "/recherche", "/publications", "/communications", "/vulgarisation", "/enseignement", "/projets", "/outils", "/these", "/laboratoire", "/contact"];

/** Every page, internal (French) path first. */
function sitemapEntries(): Entry[] {
  return [
    ...STATIC_PATHS.map((path) => ({ path, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...RESEARCH_THEMES.map((t) => ({ path: `/recherche/${t.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...PUBLICATIONS.map((p) => ({ path: `/publications/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...PUBLIC_PROJECTS.map((p) => ({ path: `/projets/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}

/** Each page in both languages, each URL listing its alternates (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = RESEARCHER.siteUrl;
  const url = (lang: Lang, path: string) => {
    const href = localePath(lang, path);
    return `${base}${href === "/" ? "" : href}`;
  };
  return sitemapEntries().flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(LANGS.map((l) => [l, url(l, path)]));
    return LANGS.map((lang) => ({ url: url(lang, path), changeFrequency, priority, alternates: { languages } }));
  });
}
