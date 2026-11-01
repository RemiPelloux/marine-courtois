/**
 * Generates docs/assets/banner.svg — the animated README banner.
 *
 *   npx tsx scripts/readme/make-banner.ts
 *
 * The curves are computed with the same residual-fertility model as the site
 * (src/lib/scientific/residual-fertility.ts). The point cloud is illustrative.
 * Fonts (SIL OFL) are embedded as data URIs because GitHub renders README
 * images in isolation. Animation is pure CSS, honours prefers-reduced-motion.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { simulateRF, RF_DEFAULTS, RF_INITIAL } from "../../src/lib/scientific/residual-fertility";
import { mulberry32, gaussian } from "../../src/lib/utils/random";

const ROOT = resolve(import.meta.dirname, "../..");
const font = (f: string) => readFileSync(resolve(import.meta.dirname, "fonts", f)).toString("base64");

const W = 1600;
const H = 800;
const C = { paper: "#F5F2EB", ink: "#0F1D2E", ver: "#2468B3", muted: "#55626F", rule: "#C5CED6" };

// chart frame
const X0 = 880;
const X1 = 1500;
const Y0 = 600; // value 0
const Y1 = 170; // value 1.05
const T_END = 300;
const SIGMA_MAX = 1000;
const x = (t: number) => X0 + (t / T_END) * (X1 - X0);
const y = (v: number) => Y0 - (Math.min(v, 1.05) / 1.05) * (Y0 - Y1);

function series(share: number) {
  const r = simulateRF({ sigma: share * SIGMA_MAX }, { tEnd: T_END, dt: 0.1, sampleEvery: 1 });
  return {
    wild: r.states.map((s) => s[1] / RF_INITIAL[1]),
    sterile: r.states.map((s) => s[0] / (SIGMA_MAX / RF_DEFAULTS.muS)),
  };
}
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

const main = series(0.4);
const fan = [0.1, 0.2, 0.3, 0.6, 1].map((s) => series(s).wild);

// illustrative point cloud, grouped in time bins that light up behind the cursor
const BINS = 30;
const rand = mulberry32(20251127);
const bins: string[][] = Array.from({ length: BINS }, () => []);
for (let i = 0; i < 900; i++) {
  const kind = i % 2;
  const t = rand() * T_END;
  const v = (kind === 0 ? main.wild : main.sterile)[Math.floor(t)];
  const spread = kind === 0 ? 0.018 + 0.075 * v : 0.012 + 0.07 * v;
  const yy = Math.max(0, v + gaussian(rand) * spread);
  const b = Math.min(BINS - 1, Math.floor((t / T_END) * BINS));
  bins[b].push(`<circle cx="${x(t).toFixed(1)}" cy="${y(yy).toFixed(1)}" r="2.6" fill="${kind ? C.ver : C.ink}" fill-opacity="${kind ? 0.85 : 0.78}"/>`);
}

const CYCLE = 11; // seconds
const DRAW = 5.5; // seconds for the cursor to cross the chart
const START = 1.2;
const pct = (s: number) => `${((s / CYCLE) * 100).toFixed(2)}%`;

const ticksX = [0, 50, 100, 150, 200, 250, 300]
  .map((t) => `<line x1="${x(t)}" y1="${Y0}" x2="${x(t)}" y2="${Y0 + 8}" stroke="${C.ink}"/><text x="${x(t)}" y="${Y0 + 32}" class="tick" text-anchor="middle">${t}</text>`)
  .join("");
const ticksY = [0, 0.2, 0.4, 0.6, 0.8, 1]
  .map((v) => `<line x1="${X0 - 8}" y1="${y(v)}" x2="${X0}" y2="${y(v)}" stroke="${C.ink}"/><text x="${X0 - 16}" y="${y(v) + 6}" class="tick" text-anchor="end">${v.toFixed(1)}</text>`)
  .join("");

function swellPath(amp: number, period: number, y: number) {
  let d = `M0 ${y}`;
  for (let px = 0; px <= W * 2; px += 10) d += ` L${px} ${(y + amp * Math.sin((px / period) * Math.PI * 2)).toFixed(1)}`;
  return `${d} L${W * 2} ${H} L0 ${H} Z`;
}
/** bleu Antibes ribbon with two slow swells — same signature as the site footer */
function ribbon() {
  const top = H - 40;
  return `<rect x="0" y="${top}" width="${W}" height="40" fill="#123A63"/>
<g class="swell2"><path d="${swellPath(4, 400, top + 16)}" fill="#1D4E80"/></g>
<g class="swell"><path d="${swellPath(3, 320, top + 26)}" fill="#0B2D4F"/></g>
<text x="${W - 80}" y="${top + 15}" class="sans" font-size="13" font-weight="500" fill="#A8BFD6" text-anchor="end">43°34′ N · 7°07′ E</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">Marine Courtois — Mathématiques, code et données : tout s'assemble.</title>
<desc id="d">Animated banner: the residual-fertility model of the sterile insect technique draws the decline of a wild population (black) as sterile males are released (accent).</desc>
<style>
@font-face{font-family:IS;src:url(data:font/woff2;base64,${font("instrument-serif-regular.woff2")}) format("woff2");}
@font-face{font-family:IS;font-style:italic;src:url(data:font/woff2;base64,${font("instrument-serif-italic.woff2")}) format("woff2");}
@font-face{font-family:MS;font-weight:100 900;src:url(data:font/woff2;base64,${font("montserrat-latin.woff2")}) format("woff2");}
.serif{font-family:IS,Georgia,serif}
.sans{font-family:MS,Helvetica,Arial,sans-serif}
.tick{font-family:MS,Helvetica,Arial,sans-serif;font-size:17px;fill:${C.ink};font-variant-numeric:tabular-nums}
.rise{opacity:0;animation:rise 1.2s cubic-bezier(.22,1,.36,1) forwards}
@keyframes rise{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
.reveal{animation:reveal ${CYCLE}s linear infinite}
@keyframes reveal{0%,${pct(START)}{transform:translateX(-${X1 - X0 + 20}px)}${pct(START + DRAW)}{transform:translateX(0)}100%{transform:translateX(0)}}
.curves{animation:fade ${CYCLE}s linear infinite}
@keyframes fade{0%,${pct(CYCLE - 1.2)}{opacity:1}100%{opacity:0}}
.bin{opacity:0;animation:bin ${CYCLE}s ease-out infinite both}
@keyframes bin{0%{opacity:0}4%{opacity:1}${pct(CYCLE - 1.2 - START)}{opacity:1}${pct(CYCLE - START - 0.4)}{opacity:0}100%{opacity:0}}
.cursor{animation:cursor ${CYCLE}s linear infinite}
@keyframes cursor{0%,${pct(START)}{transform:translateX(0);opacity:1}${pct(START + DRAW)}{transform:translateX(${X1 - X0}px);opacity:1}${pct(START + DRAW + 0.8)}{transform:translateX(${X1 - X0}px);opacity:0}100%{transform:translateX(${X1 - X0}px);opacity:0}}
.ann{opacity:0;animation:ann ${CYCLE}s ease-out infinite}
@keyframes ann{0%,${pct(START + DRAW)}{opacity:0}${pct(START + DRAW + 0.8)}{opacity:1}${pct(CYCLE - 1.2)}{opacity:1}100%{opacity:0}}
.swell{animation:swell 26s linear infinite}.swell2{animation:swell 41s linear infinite reverse}
@keyframes swell{to{transform:translateX(-${W}px)}}
.step{fill:${C.muted};animation:step ${CYCLE}s steps(1) infinite}
@keyframes step{0%{fill:${C.ver}}33.3%{fill:${C.muted}}100%{fill:${C.muted}}}
@media (prefers-reduced-motion:reduce){.swell,.swell2,.rise,.reveal,.curves,.bin,.cursor,.ann,.step{animation:none;opacity:1;transform:none}.cursor{transform:translateX(${X1 - X0}px);opacity:0}}
</style>
<rect width="${W}" height="${H}" fill="${C.paper}"/>

<!-- masthead -->
<g class="rise" style="animation-delay:.05s">
  <text x="80" y="92" class="serif" font-size="44" fill="${C.ink}">MC<tspan fill="${C.ver}">.</tspan></text>
  <text x="168" y="86" class="sans" font-size="20" font-weight="600" fill="${C.ink}">Marine A. Courtois<tspan font-weight="500" fill="${C.muted}">  —  Modélisation, data science et écologie</tspan></text>
</g>

<!-- title -->
<g class="serif" fill="${C.ink}">
  <text x="74" y="300" font-size="116" letter-spacing="-3" class="rise" style="animation-delay:.15s">Mathématiques,</text>
  <text x="74" y="420" font-size="116" letter-spacing="-3" class="rise" style="animation-delay:.3s">code et données :</text>
  <text x="74" y="540" font-size="116" letter-spacing="-3" font-style="italic" fill="${C.ver}" class="rise" style="animation-delay:.45s">tout s’assemble<tspan fill="${C.ink}" font-style="normal">.</tspan></text>
</g>
<text x="80" y="612" class="sans rise" font-size="22" font-weight="500" fill="${C.ink}" style="animation-delay:.65s">Python · R · SQL · machine learning · modèles mécanistes</text>

<!-- journey -->
<g class="sans" font-size="21" font-weight="600">
  <text x="80" y="710" class="step" style="animation-delay:0s">Observer</text>
  <text x="196" y="710" fill="${C.muted}">→</text>
  <text x="232" y="710" class="step" style="animation-delay:-${(CYCLE * 2) / 3}s">Explorer</text>
  <text x="346" y="710" fill="${C.muted}">→</text>
  <text x="382" y="710" class="step" style="animation-delay:-${CYCLE / 3}s">Comprendre</text>
</g>

<!-- chart -->
<g fill="none" stroke="${C.ink}" stroke-opacity=".14" stroke-width="1.2">${fan.map((f) => `<path d="${path(f)}"/>`).join("")}</g>
${bins.map((b, i) => `<g class="bin" style="animation-delay:${(START + (i / BINS) * DRAW).toFixed(2)}s">${b.join("")}</g>`).join("\n")}
<defs><clipPath id="sweep"><rect class="reveal" x="${X0 - 10}" y="0" width="${X1 - X0 + 20}" height="${H}"/></clipPath></defs>
<g class="curves" clip-path="url(#sweep)">
  <path d="${path(main.wild)}" fill="none" stroke="${C.ink}" stroke-width="2.4"/>
  <path d="${path(main.sterile)}" fill="none" stroke="${C.ver}" stroke-width="2.4"/>
</g>
<g class="cursor"><line x1="${X0}" y1="${Y1 - 10}" x2="${X0}" y2="${Y0}" stroke="${C.ver}" stroke-width="1.6" stroke-dasharray="4 5"/><rect x="${X0 - 5}" y="${Y0 - 5}" width="10" height="10" fill="${C.ver}"/></g>
<path d="M${X0},${Y1 - 30}V${Y0}H${X1 + 14}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>
${ticksX}${ticksY}
<text x="${X0 - 14}" y="${Y1 - 42}" class="serif" font-size="30" font-style="italic" fill="${C.ink}" text-anchor="end">N(t)</text>
<text x="${X1}" y="${Y0 + 66}" class="serif" font-size="26" font-style="italic" fill="${C.ink}" text-anchor="end">t (jours)</text>

<!-- legend -->
<g class="sans" font-size="17" font-weight="600" fill="${C.ink}">
  <rect x="${X1 - 250}" y="${Y1 - 40}" width="264" height="78" fill="${C.paper}" stroke="${C.rule}"/>
  <circle cx="${X1 - 226}" cy="${Y1 - 12}" r="7" fill="${C.ink}"/><text x="${X1 - 208}" y="${Y1 - 6}">Femelles sauvages</text>
  <circle cx="${X1 - 226}" cy="${Y1 + 18}" r="7" fill="${C.ver}"/><text x="${X1 - 208}" y="${Y1 + 24}">Mâles stériles</text>
</g>

<!-- annotations -->
<g class="ann">
  <path d="M${x(45)},${y(main.wild[45])}L${x(112)},${y(0.86)}" stroke="${C.ink}" stroke-width="1.2"/>
  <circle cx="${x(45)}" cy="${y(main.wild[45])}" r="6" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/>
  <text x="${x(114)}" y="${y(0.86)}" class="serif" font-size="23" font-style="italic" fill="${C.ink}"><tspan>Diminution de la</tspan><tspan x="${x(114)}" dy="26">population sauvage</tspan></text>
  <path d="M${x(230)},${y(main.sterile[230])}L${x(214)},${y(0.6)}" stroke="${C.ink}" stroke-width="1.2"/>
  <circle cx="${x(230)}" cy="${y(main.sterile[230])}" r="6" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/>
  <text x="${x(200)}" y="${y(0.66)}" class="serif" font-size="23" font-style="italic" fill="${C.ink}"><tspan>Lâchers répétés</tspan><tspan x="${x(200)}" dy="26">de mâles stériles</tspan></text>
</g>

${ribbon()}
<text x="${(X0 + X1) / 2}" y="${H - 66}" class="sans" font-size="15" font-weight="500" fill="${C.muted}" text-anchor="middle">Courbes : modèle de fertilité résiduelle (Courtois et al., 2025), σ = 400 ind./jour · nuage de points illustratif</text>
</svg>
`;

writeFileSync(resolve(ROOT, "docs/assets/banner.svg"), svg);
process.stdout.write(`banner.svg — ${(svg.length / 1024).toFixed(0)} kB\n`);
