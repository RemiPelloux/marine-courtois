"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, type Lang } from "@/i18n/config";
import { a11yFor } from "@/i18n/locales";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** Current language in a Client Component. */
export function useLang(): Lang {
  return useContext(LangContext);
}

/** Accessibility labels for the current language, in a Client Component. */
export function useA11y() {
  return a11yFor(useLang());
}
