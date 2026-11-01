"use client";

import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({ fr: "(nouvel onglet)", en: "(opens in a new tab)" });

/** Screen-reader hint after a link that opens a new tab; works in server and client components. */
export function NewTabHint() {
  return <span className="sr-only">{COPY[useLang()]}</span>;
}
