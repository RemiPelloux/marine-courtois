import { ARTICLES } from "@/data/publications";
import { communicationsIn } from "@/data/communications";
import { THESIS } from "@/data/thesis";
import type { Copy, Lang } from "@/i18n/config";

export type MilestoneKind = "communication" | "poster" | "article" | "doctorat";

export type Milestone = {
  id: string;
  /** ISO date, "YYYY-MM" or "YYYY-MM-DD" */
  date: string;
  kind: MilestoneKind;
  /** short name for the film caption: event acronym, journal or institution */
  short: string;
  title: string;
  url: string;
};

export const MILESTONE_KIND_LABEL: Record<MilestoneKind, Copy<string>> = {
  communication: { fr: "Communication", en: "Talk" },
  poster: { fr: "Poster", en: "Poster" },
  article: { fr: "Article", en: "Article" },
  doctorat: { fr: "Doctorat", en: "PhD" },
};

const DEFENCE: Copy<string> = { fr: "Soutenance de thèse", en: "PhD defence" };

/** "JFSMA 2024 — 32es Journées…" → "JFSMA 2024" */
const shortEvent = (event: string) => event.split(" — ")[0];

/** Verified milestones (HAL, DOI, theses.fr), oldest first, in a language. */
export function milestonesIn(lang: Lang): Milestone[] {
  return [
    ...communicationsIn(lang).map((c) => ({ id: c.id, date: c.date, kind: c.type, short: shortEvent(c.event), title: c.event.replace(" — ", ", "), url: c.url })),
    ...ARTICLES.map((a) => ({
      id: a.id,
      date: a.date ?? String(a.year),
      kind: "article" as const,
      short: a.journal ?? "Article",
      title: `${a.journal}, ${a.title}`,
      url: `https://doi.org/${a.doi}`,
    })),
    {
      id: "soutenance",
      date: THESIS.defenseDate,
      kind: "doctorat" as const,
      short: DEFENCE[lang],
      title: `${DEFENCE[lang]}, ${THESIS.institution}`,
      url: "https://theses.fr/s352892",
    },
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export const MILESTONES: Milestone[] = milestonesIn("fr");

/** Position of an ISO date on a continuous year axis: "2024-07" → 2024.5 */
export function dateToYear(iso: string): number {
  const [y, m = 1, d = 1] = iso.split("-").map(Number);
  return y + (m - 1) / 12 + (d - 1) / 365;
}
