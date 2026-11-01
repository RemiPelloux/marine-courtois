import { INTL_LOCALE, type Lang } from "@/i18n/config";

const MONTHS: Record<Lang, string[]> = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2024-11" → "novembre 2024" / "November 2024"; "2025-11-27" → "27 novembre 2025" / "27 November 2025". */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!m) return String(y);
  const month = MONTHS[lang][m - 1];
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
}

/** French date; prefer formatDate(iso, lang). */
export const formatDateFr = (iso: string) => formatDate(iso, "fr");

/** Number formats per language: 0, 1 or 2 decimals, and percent. */
export function numberFormats(lang: Lang) {
  const loc = INTL_LOCALE[lang];
  return {
    nf: new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }),
    nf1: new Intl.NumberFormat(loc, { maximumFractionDigits: 1, minimumFractionDigits: 0 }),
    nf2: new Intl.NumberFormat(loc, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
    pct: new Intl.NumberFormat(loc, { style: "percent", maximumFractionDigits: 1 }),
  };
}

const FR = numberFormats("fr");
export const { nf, nf1, nf2, pct } = FR;
