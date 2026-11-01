import type { MetadataRoute } from "next";
import { RESEARCHER } from "@/data/researcher";
import { PUBLICATIONS } from "@/data/publications";
import { RESEARCH_THEMES } from "@/data/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = RESEARCHER.siteUrl;
  const statics = ["", "/recherche", "/communication", "/enseignement", "/methodes", "/publications", "/these", "/laboratoire", "/a-propos", "/contact"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...RESEARCH_THEMES.map((t) => ({ url: `${base}/recherche/${t.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...PUBLICATIONS.map((p) => ({ url: `${base}/publications/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
