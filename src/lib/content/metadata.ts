import type { Metadata } from "next";
import { LANGS, OG_LOCALE, type Copy, type Lang } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getLang } from "@/i18n/server";

/** Canonical URL in the current language and hreflang links to both versions. */
export function languageAlternates(lang: Lang, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [l, localePath(l, path)]));
  return { canonical: localePath(lang, path), languages: { ...languages, "x-default": localePath("fr", path) } };
}

type PageText = { title: string; description: string };

/** Metadata for a page in the current language; `path` is the internal (French) path. */
export async function pageMetadata({ path, ...text }: Copy<PageText> & { path: string }): Promise<Metadata> {
  const lang = await getLang();
  const { title, description } = text[lang];
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: languageAlternates(lang, path),
    openGraph: { title, description, url, type: "website", locale: OG_LOCALE[lang] },
  };
}
