/** Site languages. French is the default and lives at the root; English lives under /en. */
export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "fr";

export const isLang = (value: string | undefined): value is Lang => (LANGS as readonly (string | undefined)[]).includes(value);

/** Open Graph locale and Intl locale per language. */
export const OG_LOCALE: Record<Lang, string> = { fr: "fr_FR", en: "en_GB" };
export const INTL_LOCALE: Record<Lang, string> = { fr: "fr-FR", en: "en-GB" };

/** Text in both languages; English must have the same shape as French. */
export type Copy<T> = { fr: T; en: T };
export function copy<T>(c: { fr: T; en: NoInfer<T> }): Copy<T> {
  return c;
}
