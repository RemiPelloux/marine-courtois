import { ImageResponse } from "next/og";
import { simulateRF } from "@/lib/scientific/residual-fertility";

export const alt = "Marine Courtois — Comprendre le vivant. Par le modèle.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const r = simulateRF({ sigma: 400 }, { tEnd: 300, dt: 0.2, sampleEvery: 5 });
  const W = 520;
  const H = 360;
  const pts = (k: number, norm: number) =>
    r.states.map((s, i) => `${(i / (r.states.length - 1)) * W},${H - (s[k] / norm) * H * 0.92}`).join(" ");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f5f2eb", color: "#171b18", padding: 64, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ fontSize: 20, letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif" }}>Marine A. Courtois</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.95 }}>
            <span>Comprendre</span>
            <span>le vivant.</span>
            <span style={{ color: "#f04a2d", fontStyle: "italic" }}>Par le modèle.</span>
          </div>
          <div style={{ fontSize: 22, fontFamily: "sans-serif", color: "#686d67" }}>Biologie mathématique · Dynamique des populations · Écologie</div>
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ marginLeft: 40, marginTop: 100 }}>
          <polyline points={pts(1, 983)} fill="none" stroke="#171b18" strokeWidth={4} />
          <polyline points={pts(0, 1000 / 0.057)} fill="none" stroke="#f04a2d" strokeWidth={4} />
          <line x1={0} y1={H} x2={W} y2={H} stroke="#171b18" strokeWidth={2} />
          <line x1={0} y1={0} x2={0} y2={H} stroke="#171b18" strokeWidth={2} />
        </svg>
      </div>
    ),
    size,
  );
}
