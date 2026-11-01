import { copy, type Lang } from "@/i18n/config";
import { numberFormats } from "@/lib/utils/format";

/**
 * Bifurcation diagram of the two-sex model with competition and a constant
 * sterile male density S, redrawn from thesisData / "Chapter 2 - Modeling SIT" /
 * fig_chapter2_thesis.ipynb with the notebook's parameters. Equilibria are
 * read from S(F): the stable branch lies above the bifurcation point, the
 * unstable one below it; F* = 0 is always an equilibrium.
 */
const P = { r: 6, p: 0.5, muF: 0.5, muM: 0.5, beta: 0.01 };

/** Sterile male density at which F is an equilibrium (notebook formula `S_of_F`). */
export function sterileForEquilibrium(F: number) {
  const { r, p, muF, muM, beta } = P;
  return -(muF * beta * F * F + (muF - r * (1 - p)) * F) / (((1 - p) * muM) / p) / (beta * F + 1);
}

/** Both branches and the saddle-node point, on the notebook's grid refined tenfold. */
export function bifurcationBranches() {
  const pts = Array.from({ length: 8000 }, (_, i) => 0.1 + (i * 800) / 8000)
    .map((F) => ({ F, S: sterileForEquilibrium(F) }))
    .filter((d) => d.S > 0);
  const top = pts.reduce((a, b) => (b.S > a.S ? b : a));
  return { stable: pts.filter((d) => d.F >= top.F), unstable: pts.filter((d) => d.F <= top.F), Sc: top.S, Fc: top.F };
}

const COPY = copy({
  fr: {
    title: (sc: string) =>
      `Diagramme de bifurcation. En abscisse, la densité de mâles stériles S ; en ordonnée, la densité de femelles à l'équilibre F*. La branche stable part de 500 femelles sans lâchers et descend ; la branche instable part de zéro et monte ; elles se rejoignent en Sc ≈ ${sc}. Au-delà, seul l'équilibre nul subsiste.`,
    x: "Densité de mâles stériles S",
    y: "Femelles à l'équilibre F*",
    stable: "stable",
    unstable: "instable : seuil",
    zero: "nul",
    beyond: ["Au-delà de Sc :", "seul l'équilibre", "nul subsiste"],
    below: ["Sous Sc : deux issues possibles,", "selon l'effectif de départ"],
  },
  en: {
    title: (sc: string) =>
      `Bifurcation diagram. Horizontal axis: density of sterile males S; vertical axis: equilibrium density of females F*. The stable branch starts at 500 females without releases and falls; the unstable branch starts at zero and rises; they meet at Sc ≈ ${sc}. Beyond it, only the zero equilibrium remains.`,
    x: "Density of sterile males S",
    y: "Equilibrium females F*",
    stable: "stable",
    unstable: "unstable: threshold",
    zero: "zero",
    beyond: ["Beyond Sc:", "only the zero", "equilibrium remains"],
    below: ["Below Sc: two possible outcomes,", "depending on the starting numbers"],
  },
});

const W = 640;
const H = 400;
const M = { top: 20, right: 12, bottom: 52, left: 78 };
const X_MAX = 280;
const Y_MAX = 520;
const sx = (S: number) => Math.round((M.left + (S / X_MAX) * (W - M.left - M.right)) * 100) / 100;
const sy = (F: number) => Math.round((H - M.bottom - (F / Y_MAX) * (H - M.top - M.bottom)) * 100) / 100;
const path = (pts: { S: number; F: number }[]) => pts.map((d, i) => `${i ? "L" : "M"}${sx(d.S)},${sy(d.F)}`).join("");

/** The chart, annotated: what each curve means, where the critical density Sc lies. */
export function BifurcationDiagram({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const b = bifurcationBranches();
  const { nf } = numberFormats(lang);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="bif-title">
      <title id="bif-title">{t.title(nf.format(b.Sc))}</title>
      <rect x={sx(b.Sc)} y={M.top} width={sx(X_MAX) - sx(b.Sc)} height={H - M.top - M.bottom} className="fill-stone" />
      <Axes lang={lang} />
      <path d={path(b.stable)} fill="none" stroke="#0f1d2e" strokeWidth={3.5} />
      <path d={path(b.unstable)} fill="none" stroke="#2468b3" strokeWidth={3} strokeDasharray="9 6" />
      <line x1={sx(0)} x2={sx(X_MAX)} y1={sy(0)} y2={sy(0)} stroke="#0f1d2e" strokeWidth={3.5} />
      <line x1={sx(b.Sc)} x2={sx(b.Sc)} y1={M.top} y2={sy(0)} stroke="#1d5a9e" strokeWidth={1.5} strokeDasharray="2 4" />
      <circle cx={sx(b.Sc)} cy={sy(b.Fc)} r={6} fill="#1d5a9e" stroke="#f5f2eb" strokeWidth={2} />
      <Labels lang={lang} Sc={b.Sc} />
    </svg>
  );
}

function Labels({ lang, Sc }: { lang: Lang; Sc: number }) {
  const t = COPY[lang];
  return (
    <g className="text-[13px] max-sm:text-[22px]">
      <text x={sx(70)} y={sy(440)} className="fill-ink font-semibold">{t.stable}</text>
      <text x={sx(45)} y={sy(80)} className="fill-accent-deep font-semibold">{t.unstable}</text>
      <text x={sx(4)} y={sy(0) - 8} className="fill-ink font-semibold">{t.zero}</text>
      <text x={sx(Sc) + 6} y={M.top + 16} className="fill-accent-deep font-serif text-[18px] italic max-sm:text-[26px]">
        S<tspan dy={4} className="text-[12px]">c</tspan>
      </text>
      <Lines lines={t.beyond} x={sx(Sc) + 10} y={sy(330)} className="fill-ink text-[12px] max-sm:hidden" />
      <Lines lines={t.below} x={sx(6)} y={sy(215)} className="fill-muted text-[12px] max-sm:hidden" />
    </g>
  );
}

function Lines({ lines, x, y, className }: { lines: string[]; x: number; y: number; className: string }) {
  return (
    <text x={x} y={y} className={className}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i ? 15 : 0}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Axes({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <g className="fill-ink text-[12px] tabular-nums max-sm:text-[20px]">
      <path d={`M${M.left},${M.top}V${H - M.bottom}H${W - M.right}`} stroke="#0f1d2e" fill="none" />
      {[0, 50, 100, 150, 200, 250].map((v) => (
        <text key={v} x={sx(v)} y={H - M.bottom + 20} textAnchor="middle" fillOpacity={0.8}>{v}</text>
      ))}
      {[0, 100, 200, 300, 400, 500].map((v) => (
        <text key={v} x={M.left - 10} y={sy(v)} dy="0.35em" textAnchor="end" fillOpacity={0.8}>{v}</text>
      ))}
      <text x={W - M.right} y={H - 8} textAnchor="end" className="font-serif text-[16px] italic max-sm:text-[22px]">{t.x}</text>
      <text textAnchor="middle" className="font-serif text-[16px] italic max-sm:text-[22px]" transform={`translate(16,${(M.top + H - M.bottom) / 2}) rotate(-90)`}>{t.y}</text>
    </g>
  );
}
