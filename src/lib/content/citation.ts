import type { Publication } from "@/types/content";

/**
 * Bibliographic exports for the publication pages: BibTeX and a readable
 * reference ("Courtois, M. A., … (2026). Title. Journal, 22(4), e1014212.").
 */

/** "22(4)" → { volume: "22", number: "4" } */
function splitVolume(v?: string) {
  const m = v?.match(/^(\d+)\((\d+)\)$/);
  return m ? { volume: m[1], number: m[2] } : { volume: v, number: undefined };
}

const lastName = (full: string) => full.trim().split(" ").slice(-1)[0];
const ascii = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]/g, "");

/** "Marine A. Courtois" → "Courtois, Marine A." ; particles (van, de) stay with the family name. */
function bibName(full: string) {
  const parts = full.trim().split(" ");
  const i = parts.findIndex((p, k) => k > 0 && /^(van|von|de|du|der)$/.test(p));
  const cut = i > 0 ? i : parts.length - 1;
  return `${parts.slice(cut).join(" ")}, ${parts.slice(0, cut).join(" ")}`;
}

export function bibtexKey(p: Publication) {
  const word = p.title.split(/\s+/).find((w) => w.length > 3) ?? "pub";
  return `${ascii(lastName(p.authors[0])).toLowerCase()}${p.year}${ascii(word).toLowerCase()}`;
}

export function toBibtex(p: Publication): string {
  const { volume, number } = splitVolume(p.volume);
  const thesis = p.publicationType === "these";
  const fields: [string, string | undefined][] = [
    ["title", `{${p.title}}`],
    ["author", p.authors.map(bibName).join(" and ")],
    [thesis ? "school" : "journal", thesis ? "Université Côte d'Azur" : p.journal],
    ["year", String(p.year)],
    ["volume", volume],
    ["number", number],
    ["pages", p.pages],
    ["doi", p.doi],
    ["url", p.doi ? `https://doi.org/${p.doi}` : p.sourceUrl],
  ];
  const body = fields
    .filter((f): f is [string, string] => Boolean(f[1]))
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(",\n");
  return `@${thesis ? "phdthesis" : "article"}{${bibtexKey(p)},\n${body}\n}`;
}

/** "Marine A. Courtois" → "Courtois, M. A." */
function apaName(full: string) {
  const [family, given] = bibName(full).split(", ");
  const initials = given.split(/[\s-]+/).map((g) => `${g[0]}.`).join(" ");
  return `${family}, ${initials}`;
}

export function formatReference(p: Publication): string {
  const names = p.authors.map(apaName);
  const authors = names.length > 1 ? `${names.slice(0, -1).join(", ")}, & ${names.at(-1)}` : names[0];
  const where = p.publicationType === "these" ? "Thèse de doctorat, Université Côte d'Azur" : [p.journal, p.volume, p.pages].filter(Boolean).join(", ");
  const doi = p.doi ? ` https://doi.org/${p.doi}` : "";
  return `${authors} (${p.year}). ${p.title}. ${where}.${doi}`;
}
