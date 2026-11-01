const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** "2024-11" → "novembre 2024", "2025-11-27" → "27 novembre 2025" */
export function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!m) return String(y);
  const month = MONTHS[m - 1];
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
}

export const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
export const nf1 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
export const nf2 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const pct = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });
