import type { MetadataRoute } from "next";
import { RESEARCHER } from "@/data/researcher";
import { PUBLICATIONS } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";
import { PUBLIC_PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = RESEARCHER.siteUrl;
  const statics = ["", "/parcours", "/recherche", "/publications", "/communications", "/vulgarisation", "/enseignement", "/projets", "/outils", "/these", "/laboratoire", "/contact"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...RESEARCH_THEMES.map((t) => ({ url: `${base}/recherche/${t.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...PUBLICATIONS.map((p) => ({ url: `${base}/publications/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
    ...PUBLIC_PROJECTS.map((p) => ({ url: `${base}/projets/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
