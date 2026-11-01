import { ARTICLES, COMMUNICATIONS } from "@/data/publications";
import { THESIS } from "@/data/thesis";

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

export const MILESTONE_KIND_LABEL: Record<MilestoneKind, string> = {
  communication: "Communication",
  poster: "Poster",
  article: "Article",
  doctorat: "Doctorat",
};

/** "JFSMA 2024 — 32es Journées…" → "JFSMA 2024" */
const shortEvent = (event: string) => event.split(" — ")[0];

/** Verified milestones (HAL, DOI, theses.fr), oldest first. */
export const MILESTONES: Milestone[] = [
  ...COMMUNICATIONS.map((c) => ({ id: c.id, date: c.date, kind: c.type, short: shortEvent(c.event), title: c.event.replace(" — ", ", "), url: c.url })),
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
    short: "Soutenance de thèse",
    title: `Soutenance de thèse, ${THESIS.institution}`,
    url: "https://theses.fr/s352892",
  },
].sort((a, b) => a.date.localeCompare(b.date));

/** Position of an ISO date on a continuous year axis: "2024-07" → 2024.5 */
export function dateToYear(iso: string): number {
  const [y, m = 1, d = 1] = iso.split("-").map(Number);
  return y + (m - 1) / 12 + (d - 1) / 365;
}
