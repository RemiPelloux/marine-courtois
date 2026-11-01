import type { Lang } from "@/i18n/config";
import { fr } from "@/i18n/locales/fr";
import { en } from "@/i18n/locales/en";

export type A11y = Record<keyof typeof fr, string>;
const DICTS: Record<Lang, A11y> = { fr, en };

export function a11yFor(lang: Lang): A11y {
  return DICTS[lang];
}
