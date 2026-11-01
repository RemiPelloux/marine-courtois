import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { isLang, type Lang } from "@/i18n/config";
import { a11yFor } from "@/i18n/locales";

/** Current language in a Server Component (from the root [lang] segment). */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  if (!isLang(value)) notFound();
  return value;
}

/** Accessibility labels for the current language, in a Server Component. */
export async function getA11y() {
  return a11yFor(await getLang());
}
