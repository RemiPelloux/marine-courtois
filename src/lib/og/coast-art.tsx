import { rng } from "@/lib/fish/sim";

/**
 * The footer's night on the Cap d'Antibes (components/layout/CoastScene.tsx), redrawn
 * still at share-card scale: starry sky, headland with umbrella pines, the square
 * Garoupe tower with its lit lantern, a beam crossing the sky, three layers of sea.
 */
const W = 1200;
const H = 630;
const HORIZON = 470;
/** Lantern, and the scale of the tower drawn around it (CoastScene units × K). */
const L = { x: 1000, y: 236 };
const K = 3.2;

const r2 = (n: number) => Math.round(n * 100) / 100;
/** Point of the tower, in CoastScene units relative to the lantern. */
const at = (dx: number, dy: number) => `${r2(L.x + dx * K)} ${r2(L.y + dy * K)}`;

function wave(amp: number, period: number, y: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= W; x += 10) d += ` L${x} ${r2(y + amp * Math.sin((x / period) * Math.PI * 2) + amp * 0.35 * Math.sin((x / period) * Math.PI * 6))}`;
  return { fill: `${d} L${W} ${H} L0 ${H} Z`, crest: d };
}

const rand = rng(43);
const STARS = Array.from({ length: 60 }, () => ({ x: r2(rand() * W), y: r2(rand() * (HORIZON - 60)), r: r2(0.8 + rand() * 1.6) }));
const BACK = wave(4, 520, HORIZON + 4);
const MID = wave(7, 700, HORIZON + 54);
const FRONT = wave(10, 900, HORIZON + 112);

function defs() {
  return (
    <defs>
      <linearGradient id="og-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#061a2e" />
        <stop offset="1" stopColor="#14497a" />
      </linearGradient>
      <radialGradient id="og-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff4d6" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#ffe3a3" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffe3a3" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="og-beam" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#fff1c7" stopOpacity="0.28" />
        <stop offset="1" stopColor="#fff1c7" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function pine(x: number, y: number, s: number) {
  return (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`} fill="#04121f">
      <path d="M0 0 C1 -10 -2 -18 2 -28" stroke="#04121f" strokeWidth="2.4" fill="none" />
      <ellipse cx="2" cy="-31" rx="17" ry="5" />
      <ellipse cx="-6" cy="-35" rx="10" ry="4" />
      <ellipse cx="9" cy="-36" rx="9" ry="3.5" />
    </g>
  );
}

function headland() {
  return (
    <g>
      <path d="M500 484 C640 474 760 456 850 448 C920 442 1080 440 1140 446 C1170 449 1190 454 1200 456 L1200 492 L500 492 Z" fill="#071d33" />
      <path d={`M${at(-52, 68)} L${at(-52, 48)} L${at(-18, 48)} L${at(-18, 68)} Z`} fill="#0a2238" />
      <path d={`M${at(-56, 50)} L${at(-35, 39)} L${at(-14, 50)} Z`} fill="#0a2238" />
      <path d={`M${at(-42, 54)} L${at(-38, 54)} L${at(-38, 59)} L${at(-42, 59)} Z`} fill="#ffd98a" opacity="0.7" />
      {pine(790, 458, 2.4)}
      {pine(860, 450, 2.9)}
      {pine(1110, 444, 2.7)}
      {pine(1172, 452, 3.1)}
    </g>
  );
}

const rect = (x: number, y: number, w: number, h: number) => `M${at(x, y)} L${at(x + w, y)} L${at(x + w, y + h)} L${at(x, y + h)} Z`;

function lighthouse() {
  return (
    <g>
      <path d={`M${at(-12, 66)} L${at(-10, 12)} L${at(10, 12)} L${at(12, 66)} Z`} fill="#c9bfae" />
      <path d={`M${at(1, 66)} L${at(1, 12)} L${at(10, 12)} L${at(12, 66)} Z`} fill="#8f8574" />
      <path d={rect(-2, 26, 4, 7)} fill="#2b2a28" />
      <path d={rect(-2, 44, 4, 7)} fill="#2b2a28" />
      <path d={rect(-15, 9, 30, 4)} fill="#d9cfbd" />
      <path d={rect(-7, -5, 14, 14)} fill="#2d2a24" />
      <path d={rect(-5, -3, 10, 11)} fill="#ffe7a6" />
      <path d={`M${at(-8, -5)} Q${at(0, -15)} ${at(8, -5)} Z`} fill="#3a352d" />
      <circle cx={L.x} cy={L.y + 2 * K} r={26 * K} fill="url(#og-glow)" />
    </g>
  );
}

function sailboat(x: number, y: number, s: number) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-16 0 L16 0 L11 6 L-12 6 Z" fill="#04121f" />
      <path d="M0 -1 L0 -30" stroke="#04121f" strokeWidth="1.4" />
      <path d="M1 -29 L15 -3 L1 -3 Z" fill="#d9cfbd" />
      <path d="M-1 -26 L-11 -3 L-1 -3 Z" fill="#b8ad99" />
    </g>
  );
}

function sea() {
  return (
    <g>
      <path d={BACK.fill} fill="#1d4e80" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${L.x - 30 + ((i * 17) % 40)} ${HORIZON + 14 + i * 9} h${44 - i * 6} v3 h${-(44 - i * 6)} Z`} fill="#ffe7a6" opacity={0.7 - i * 0.1} />
      ))}
      {sailboat(420, HORIZON + 26, 2.2)}
      <path d={MID.fill} fill="#164170" />
      <path d={MID.crest} fill="none" stroke="#8fc1ea" strokeOpacity="0.25" strokeWidth="2" />
      <path d={FRONT.fill} fill="#0b2d4f" />
      <path d={FRONT.crest} fill="none" stroke="#cfe5f8" strokeOpacity="0.35" strokeWidth="2.4" />
    </g>
  );
}

/** Full-bleed background of a "coast" card. */
export function CoastArt() {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 0, left: 0 }}>
      {defs()}
      <rect width={W} height={HORIZON + 10} fill="url(#og-sky)" />
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#d6ecff" opacity="0.75" />
      ))}
      <path d={`M${L.x} ${L.y} L-100 ${L.y - 300} L-100 ${L.y - 40} Z`} fill="url(#og-beam)" />
      {headland()}
      {lighthouse()}
      {sea()}
    </svg>
  );
}
