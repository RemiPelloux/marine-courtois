import { rng } from "@/lib/fish/sim";

/**
 * Night on the Cap d'Antibes, at the top of the footer: the square tower of the
 * Garoupe lighthouse on its headland among umbrella pines, its beam sweeping
 * the sky, the Mediterranean rolling in three layers below. Pure SVG + CSS
 * (globals.css, "Coast scene"); still under reduced motion. Decorative only.
 */
const W = 1440;
const H = 240;
const HORIZON = 156;
/** Lantern of the lighthouse, in scene coordinates. */
const LAMP = { x: 1176, y: 40 };

const r2 = (n: number) => Math.round(n * 100) / 100;

/** A wave band: two identical periods side by side, so a -50% drift loops seamlessly. */
function wave(amp: number, period: number, y: number, bottom = H) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= W * 2; x += 12) d += ` L${x} ${r2(y + amp * Math.sin((x / period) * Math.PI * 2) + amp * 0.35 * Math.sin((x / period) * Math.PI * 6))}`;
  return { fill: `${d} L${W * 2} ${bottom} L0 ${bottom} Z`, crest: d };
}

const rand = rng(43);
/** Stars, kept clear of the coordinates label in the top-left corner. */
const STARS = Array.from({ length: 52 }, (_, i) => ({ x: r2(rand() * W), y: r2(rand() * (HORIZON - 40)), r: r2(0.5 + rand() * 1.1), d: r2(rand() * 6), i })).filter((s) => !(s.x < 420 && s.y < 46));

function Sky() {
  return (
    <>
      <defs>
        <linearGradient id="coast-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#061a2e" />
          <stop offset="1" stopColor="#14497a" />
        </linearGradient>
        <radialGradient id="coast-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffe3a3" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffe3a3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coast-beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fff1c7" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff1c7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={HORIZON + 4} fill="url(#coast-sky)" />
      {STARS.map((s) => (
        <circle key={s.i} className="coast-star" cx={s.x} cy={s.y} r={s.r} fill="#d6ecff" style={{ animationDelay: `${s.d}s` }} />
      ))}
    </>
  );
}

/** Umbrella pine: a bent trunk and a flat, layered crown. */
function Pine({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#04121f">
      <path d="M0 0 C1 -10 -2 -18 2 -28" stroke="#04121f" strokeWidth="2.4" fill="none" />
      <ellipse cx="2" cy="-31" rx="17" ry="5" />
      <ellipse cx="-6" cy="-35" rx="10" ry="4" />
      <ellipse cx="9" cy="-36" rx="9" ry="3.5" />
    </g>
  );
}

/**
 * A Siberian cat sitting on the headland, seen against the night: thick ruff,
 * tufted ears, a big plume of a tail that sways; its eyes catch the lighthouse.
 * Drawn facing left; `flip` turns it to face right.
 */
function SiberianCat({ x, y, s, flip = false, delay = 0 }: { x: number; y: number; s: number; flip?: boolean; delay?: number }) {
  const fur = "#04121f";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="coast-cat-tail" style={{ animationDelay: `${delay}s` }}>
        <path d="M6 -2 C14 -1 19 -6 18 -13 C17.5 -17 15 -19 13 -19" fill="none" stroke={fur} strokeWidth="5.5" strokeLinecap="round" />
      </g>
      <ellipse cx="2" cy="-7.5" rx="8.5" ry="8" fill={fur} />
      <ellipse cx="5" cy="-5" rx="6.5" ry="5.5" fill={fur} />
      <path d="M-9 -14 C-11 -10 -9 -6 -5 -5 C-1 -6 1 -10 -1 -14 Z" fill={fur} />
      <circle cx="-4.5" cy="-18.5" r="5.2" fill={fur} />
      <path d="M-9.4 -20 L-9 -27.5 L-5.6 -22.6 Z M-3.4 -22.8 L-0.6 -27.6 L0.2 -20.4 Z" fill={fur} />
      <path d="M-9 -27.5 L-9.3 -29.5 M-0.6 -27.6 L-0.2 -29.6" stroke={fur} strokeWidth="0.6" />
      <path d="M-7 -1 L-6.5 0 M-3 -1 L-2.5 0" stroke={fur} strokeWidth="2" strokeLinecap="round" />
      <path d="M-11 -9 Q-12.5 -11 -11.2 -13 M1 -12 Q2.6 -14 1.6 -16" stroke="#1d4e80" strokeWidth="0.7" fill="none" opacity="0.8" />
      <g className="coast-cat-eyes" style={{ animationDelay: `${delay + 1.3}s` }}>
        <circle cx="-6.6" cy="-19" r="0.95" fill="#d8e67a" />
        <circle cx="-3" cy="-19" r="0.95" fill="#d8e67a" />
      </g>
    </g>
  );
}

function Headland() {
  return (
    <g>
      <path d="M930 160 C1010 150 1060 118 1110 108 C1150 100 1210 100 1250 108 C1310 118 1370 140 1440 150 L1440 170 L930 170 Z" fill="#071d33" />
      <rect x="1124" y="88" width="34" height="20" fill="#0a2238" />
      <path d="M1120 90 L1141 79 L1162 90 Z" fill="#0a2238" />
      <rect x="1134" y="94" width="4" height="5" fill="#ffd98a" opacity="0.7" />
      <Pine x={1060} y={124} s={0.9} />
      <Pine x={1090} y={114} s={1.1} />
      <Pine x={1236} y={108} s={1} />
      <Pine x={1290} y={118} s={1.2} />
      <Pine x={1340} y={132} s={0.8} />
      <SiberianCat x={1210} y={103} s={1.15} />
      <SiberianCat x={1266} y={112} s={1.05} flip delay={1.7} />
    </g>
  );
}

/** The Garoupe tower: square, stone, a gallery, a glazed lantern and its dome. */
function Lighthouse() {
  return (
    <g>
      <path d={`M${LAMP.x - 12} 106 L${LAMP.x - 10} 52 L${LAMP.x + 10} 52 L${LAMP.x + 12} 106 Z`} fill="#c9bfae" />
      <path d={`M${LAMP.x + 1} 106 L${LAMP.x + 1} 52 L${LAMP.x + 10} 52 L${LAMP.x + 12} 106 Z`} fill="#8f8574" />
      <rect x={LAMP.x - 2} y="66" width="4" height="7" fill="#2b2a28" />
      <rect x={LAMP.x - 2} y="84" width="4" height="7" fill="#2b2a28" />
      <rect x={LAMP.x - 15} y="49" width="30" height="4" fill="#d9cfbd" />
      <rect x={LAMP.x - 7} y="35" width="14" height="14" fill="#2d2a24" />
      <rect className="coast-lantern" x={LAMP.x - 5} y="37" width="10" height="11" fill="#ffe7a6" />
      <path d={`M${LAMP.x - 8} 35 Q${LAMP.x} 25 ${LAMP.x + 8} 35 Z`} fill="#3a352d" />
      <circle className="coast-halo" cx={LAMP.x} cy={LAMP.y + 2} r="26" fill="url(#coast-glow)" />
    </g>
  );
}

/** The beam turns with the lens: long to one side, foreshortened as it faces us, long to the other. */
function Beam() {
  return (
    <g className="coast-beam" style={{ transformOrigin: `${LAMP.x}px ${LAMP.y + 2}px` }}>
      <path d={`M${LAMP.x} ${LAMP.y} L${LAMP.x - 900} ${LAMP.y - 70} L${LAMP.x - 900} ${LAMP.y + 60} Z`} fill="url(#coast-beam)" />
    </g>
  );
}

/** A small sailing boat crossing the bay, rocking on the swell. */
function Sailboat() {
  return (
    <g className="coast-boat">
      <g className="coast-boat-rock">
        <path d="M-16 0 L16 0 L11 6 L-12 6 Z" fill="#04121f" />
        <path d="M0 -1 L0 -30" stroke="#04121f" strokeWidth="1.4" />
        <path d="M1 -29 L15 -3 L1 -3 Z" fill="#d9cfbd" />
        <path d="M-1 -26 L-11 -3 L-1 -3 Z" fill="#b8ad99" />
      </g>
    </g>
  );
}

const BACK = wave(2.5, 260, HORIZON + 2);
const MID = wave(4, 380, HORIZON + 22);
const FRONT = wave(6, 520, HORIZON + 46);

function Sea() {
  return (
    <>
      <path className="coast-wave coast-wave--back" d={BACK.fill} fill="#1d4e80" />
      <g className="coast-glints">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} className="coast-glint" x={LAMP.x - 14 + ((i * 7) % 20)} y={HORIZON + 8 + i * 9} width={18 - i * 2} height="1.6" rx="0.8" fill="#ffe7a6" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </g>
      <g transform={`translate(0 ${HORIZON + 20})`}>
        <Sailboat />
      </g>
      <path className="coast-wave coast-wave--mid" d={MID.fill} fill="#164170" />
      <path className="coast-wave coast-wave--mid" d={MID.crest} fill="none" stroke="#8fc1ea" strokeOpacity="0.25" strokeWidth="1" />
      <path className="coast-wave coast-wave--front" d={FRONT.fill} fill="#0b2d4f" />
      <path className="coast-wave coast-wave--front" d={FRONT.crest} fill="none" stroke="#cfe5f8" strokeOpacity="0.35" strokeWidth="1.3" />
    </>
  );
}

export function CoastScene() {
  return (
    <div className="relative h-[180px] overflow-hidden md:h-[240px]" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice">
        <Sky />
        <Beam />
        <Headland />
        <Lighthouse />
        <Sea />
      </svg>
      <span className="site-gutter absolute inset-x-0 top-3 mx-auto hidden max-w-site text-xs tracking-wide text-mist/80 tabular-nums sm:flex">
        Antibes · 43°34′ N · 7°07′ E
      </span>
    </div>
  );
}
