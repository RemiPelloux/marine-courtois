import { ImageResponse } from "next/og";
import { buildBoard } from "@/components/puzzle/board";
import { CELL, FAMILY_FILL, PAD } from "@/components/puzzle/constants";

export const alt = "Marine Courtois — Modéliser le vivant, simuler, analyser : tout s'assemble.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function fillOf(slot: ReturnType<typeof buildBoard>["slots"][number]) {
  if (slot.kind === "tool") return FAMILY_FILL[slot.item.family];
  return slot.kind === "axis" ? "#e4eaef" : "none";
}

export default function OpengraphImage() {
  const { slots, view } = buildBoard();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#f5f2eb", color: "#0f1d2e", padding: 64, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 600 }}>
          <div style={{ fontSize: 24, fontFamily: "sans-serif" }}>Marine A. Courtois</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 80, lineHeight: 0.98 }}>
            <span>Modéliser le vivant,</span>
            <span>simuler, analyser :</span>
            <span style={{ color: "#2468b3", fontStyle: "italic" }}>tout s&apos;assemble.</span>
          </div>
          <div style={{ fontSize: 22, fontFamily: "sans-serif", color: "#55626f" }}>Biologie mathématique · Simulation · Données</div>
        </div>
        <svg width={470} height={470} viewBox={`${-PAD} ${-PAD} ${view} ${view}`} style={{ marginLeft: 40 }}>
          {slots.map((s) => (
            <path
              key={`${s.r}-${s.c}`}
              d={s.path}
              transform={`translate(${s.c * CELL} ${s.r * CELL})`}
              fill={fillOf(s)}
              stroke={s.kind === "project" ? "#2468b3" : "#f5f2eb"}
              strokeWidth={s.kind === "project" ? 3 : 1.5}
              strokeDasharray={s.kind === "project" ? "8 6" : undefined}
            />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
