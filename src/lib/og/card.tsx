import { ImageResponse } from "next/og";
import type { Lang } from "@/i18n/config";
import { RESEARCHER } from "@/data/researcher";
import { CoastArt } from "@/lib/og/coast-art";
import { OG_FONTS, SANS } from "@/lib/og/fonts";
import { OG_SIZE, type Motif } from "@/lib/og/meta";
import { PAPER, PuzzleArt } from "@/lib/og/puzzle-art";
import { Title } from "@/lib/og/title";

/** Text colours on paper (puzzle cards) and on the night sky (coast cards). */
const TONES = {
  puzzle: { title: "#0f1d2e", name: "#0f1d2e", label: "#2468b3", muted: "#55626f" },
  coast: { title: PAPER, name: "#cfe5f8", label: "#ffe3a3", muted: "#a9c8e6" },
};

export type Card = { lang: Lang; title: string; motif: Motif; label?: string };

const PAD_Y = 56;
const PAD_X = 64;

/** Name (and the section of a detail page), the title, the discipline: top, middle, bottom. */
function TextColumn({ lang, title, motif, label }: Card) {
  const tone = TONES[motif];
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: motif === "puzzle" ? 600 : 700, height: "100%" }}>
      <div style={{ display: "flex", fontFamily: SANS, fontSize: 26, color: tone.name }}>
        <span>{RESEARCHER.name}</span>
        {label ? <span style={{ color: tone.label, marginLeft: 10 }}>{`· ${label}`}</span> : null}
      </div>
      <Title text={title} color={tone.title} />
      <div style={{ display: "flex", fontFamily: SANS, fontSize: 22, color: tone.muted }}>{RESEARCHER.discipline[lang]}</div>
    </div>
  );
}

function CardBody(card: Card) {
  const coast = card.motif === "coast";
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: `${PAD_Y}px ${PAD_X}px`,
        background: coast ? "#061a2e" : PAPER,
      }}
    >
      {coast ? <CoastArt /> : null}
      <TextColumn {...card} />
      {coast ? null : <PuzzleArt lang={card.lang} height={OG_SIZE.height - PAD_Y * 2} />}
    </div>
  );
}

/** The 1200 × 630 PNG of a page. */
export function renderCard(card: Card): ImageResponse {
  return new ImageResponse(<CardBody {...card} />, { ...OG_SIZE, fonts: OG_FONTS });
}
