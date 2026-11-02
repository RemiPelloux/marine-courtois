import { ImageResponse } from "next/og";
import { copy } from "@/i18n/config";
import { RESEARCHER } from "@/data/researcher";
import { OG_FONTS, SANS, SERIF } from "@/lib/og/fonts";
import { cardMetadata, langParam, OG_SIZE, type SlugParams } from "@/lib/og/meta";
import { PAPER, PuzzleArt } from "@/lib/og/puzzle-art";

const COPY = copy({
  fr: { lines: ["Modéliser le vivant,", "simuler, analyser\u00a0:", "tout s'assemble."], footer: "Mathématiques · Biologie · Data & ML · Calcul" },
  en: { lines: ["Modelling life,", "simulating, analysing:", "it all fits together."], footer: "Mathematics · Biology · Data & ML · Computing" },
});

export function generateImageMetadata({ params }: { params: SlugParams }) {
  return cardMetadata(params.lang, "puzzle", (lang) => COPY[lang].lines.join(" "));
}

export default async function OpengraphImage({ params }: { params: Promise<SlugParams> }) {
  const lang = langParam((await params).lang);
  const t = COPY[lang];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: PAPER, color: "#0f1d2e", padding: "56px 64px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 640 }}>
          <div style={{ fontSize: 26, fontFamily: SANS }}>{RESEARCHER.name}</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: SERIF, fontSize: 78, lineHeight: 0.98 }}>
            <span>{t.lines[0]}</span>
            <span>{t.lines[1]}</span>
            <span style={{ color: "#2468b3", fontStyle: "italic" }}>{t.lines[2]}</span>
          </div>
          <div style={{ fontSize: 22, fontFamily: SANS, color: "#55626f" }}>{t.footer}</div>
        </div>
        <PuzzleArt lang={lang} height={OG_SIZE.height - 112} />
      </div>
    ),
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}
