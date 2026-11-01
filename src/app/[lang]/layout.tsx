import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Montserrat, IBM_Plex_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "../globals.css";
import "../puzzle.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { RESEARCHER } from "@/data/researcher";
import { LANGS, OG_LOCALE, copy, type Lang } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { LangProvider } from "@/i18n/client";
import { languageAlternates } from "@/lib/content/metadata";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** monospace is reserved for real code blocks */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE = copy({
  fr: {
    discipline: "Mathématiques appliquées à la biologie — Analyse de données",
    description:
      "Marine A. Courtois, docteure en mathématiques appliquées à la biologie (Université Côte d'Azur, 2025). Modélisation, simulation, analyse de données et machine learning appliqués aux systèmes biologiques.",
    skip: "Aller au contenu",
  },
  en: {
    discipline: "Applied mathematics for biology — Data analysis",
    description:
      "Marine A. Courtois, PhD in applied mathematics for biology (Université Côte d'Azur, 2025). Modelling, simulation, data analysis and machine learning applied to biological systems.",
    skip: "Skip to content",
  },
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = SITE[lang];
  return {
    metadataBase: new URL(RESEARCHER.siteUrl),
    title: { default: `${RESEARCHER.displayName} — ${t.discipline}`, template: `%s — ${RESEARCHER.displayName}` },
    description: t.description,
    authors: [{ name: RESEARCHER.name }],
    alternates: languageAlternates(lang, "/"),
    openGraph: { type: "website", locale: OG_LOCALE[lang], siteName: RESEARCHER.displayName },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang: Lang = await getLang();
  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning className={`${instrument.variable} ${montserrat.variable} ${plexMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <LangProvider lang={lang}>
        <a
          href="#contenu"
          className="label fixed top-2 left-2 z-[100] -translate-y-20 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          {SITE[lang].skip}
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        </LangProvider>
      </body>
    </html>
  );
}
