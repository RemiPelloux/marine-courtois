import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Montserrat, IBM_Plex_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RESEARCHER } from "@/data/researcher";

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

export const metadata: Metadata = {
  metadataBase: new URL(RESEARCHER.siteUrl),
  title: {
    default: `${RESEARCHER.displayName} — Biologie mathématique`,
    template: `%s — ${RESEARCHER.displayName}`,
  },
  description:
    "Marine A. Courtois, docteure en biologie mathématique (Université Côte d'Azur, 2025). Modèles de dynamique des populations, technique de l'insecte stérile, modélisation individu-centrée, écologie des invasions.",
  authors: [{ name: RESEARCHER.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: `${RESEARCHER.displayName} — A Living Research Atlas`,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${instrument.variable} ${montserrat.variable} ${plexMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="label fixed top-2 left-2 z-[100] -translate-y-20 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
