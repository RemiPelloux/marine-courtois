import { DEFAULT_LANG, type Lang } from "@/i18n/config";

/**
 * Translations of data files are overlays: the French entry stays the source,
 * the English file lists only the translated fields, keyed by id. Objects merge
 * key by key and arrays item by item, so facts (dates, DOIs, numbers) are never
 * copied twice.
 */
export type Overlay<T> = T extends string | number | boolean | null | undefined
  ? T
  : T extends readonly (infer U)[]
    ? readonly Overlay<U>[]
    : { [K in keyof T]?: Overlay<T[K]> };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function merge<T>(base: T, over: unknown): T {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => merge(b, over[i])) as T;
  if (isObject(base) && isObject(over)) {
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
    return out as T;
  }
  return over as T;
}

/** One item in a language: French as is (the source), any other language with its overlay applied. */
export function localizeOne<T>(item: T, overlay: Overlay<NoInfer<T>> | undefined, lang: Lang): T {
  if (lang === DEFAULT_LANG) return item;
  return merge(item, overlay);
}

/** Items in a language: French as is, English with the overlay of each id applied. */
export function localizeById<T extends { id: string }>(items: readonly T[], overlay: Record<string, Overlay<NoInfer<T>>>, lang: Lang): T[] {
  return items.map((item) => localizeOne(item, overlay[item.id], lang));
}

/** Items in a language, the overlay keyed by any field (slug, number…). */
export function localizeBy<T>(items: readonly T[], key: (item: T) => string | number, overlay: Record<string, Overlay<NoInfer<T>>>, lang: Lang): T[] {
  return items.map((item) => localizeOne(item, overlay[String(key(item))], lang));
}

/** A record keyed by id, in a language. */
export function localizeRecord<T>(record: Record<string, T>, overlay: Record<string, Overlay<NoInfer<T>>>, lang: Lang): Record<string, T> {
  return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, localizeOne(v, overlay[k], lang)]));
}
