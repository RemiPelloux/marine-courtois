import { copy, type Lang } from "@/i18n/config";

/**
 * The three compartments of the residual-fertility model (Courtois et al. 2025),
 * drawn from its equations: releases σ feed S with the sterile fraction (1 − δ)
 * and M with the fertile fraction δ; females F reproduce after mating with M,
 * or with S when a sterile mating stays fertile (ε); births give females and
 * males; every compartment loses individuals to mortality.
 */
const COPY = copy({
  fr: {
    title:
      "Modèle à trois compartiments. Les lâchers σ alimentent les mâles stériles S pour la fraction stérilisée 1 − δ, et les mâles sauvages M pour la fraction δ restée fertile. Les femelles F se reproduisent après un accouplement avec un mâle sauvage, ou avec un mâle stérile lorsque l'accouplement reste fertile (ε). Les naissances donnent des femelles et des mâles. Chaque compartiment perd des individus par mortalité.",
    names: { S: "Mâles stériles relâchés", F: "Femelles sauvages", M: "Mâles sauvages" },
    releases: "lâchers σ",
    mortality: "mortalité",
    fertile: ["accouplement", "fertile (ε)"],
    matings: ["accouple-", "ments"],
    birthsM: "naissances ♂",
    birthsF: "naissances ♀",
  },
  en: {
    title:
      "Three-compartment model. Releases σ feed the sterile males S with the sterilised fraction 1 − δ, and the wild males M with the fraction δ that stayed fertile. Females F reproduce after mating with a wild male, or with a sterile male when the mating stays fertile (ε). Births give females and males. Every compartment loses individuals through mortality.",
    names: { S: "Released sterile males", F: "Wild females", M: "Wild males" },
    releases: "releases σ",
    mortality: "mortality",
    fertile: ["fertile", "mating (ε)"],
    matings: ["matings", ""],
    birthsM: "births ♂",
    birthsF: "births ♀",
  },
});

const BOX = [
  { id: "S", x: 20 },
  { id: "F", x: 250 },
  { id: "M", x: 480 },
] as const;

export function CompartmentDiagram({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <figure className="max-w-3xl">
      <svg viewBox="0 0 640 300" className="h-auto w-full" role="img" aria-labelledby="cd-title">
        <title id="cd-title">{t.title}</title>
        <defs>
          <marker id="cd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#0b2d4f" />
          </marker>
        </defs>
        <text x={300} y={20} textAnchor="middle" className="fill-ink text-[13px]">
          {t.releases}
        </text>
        <path d="M280 26 C 200 30, 110 40, 90 116" fill="none" stroke="#2468b3" strokeWidth={2} markerEnd="url(#cd-arrow)" />
        <text x={70} y={66} textAnchor="end" className="fill-accent-deep text-[12px]">(1 − δ) σ</text>
        <path d="M320 26 C 400 30, 530 40, 550 116" fill="none" stroke="#2468b3" strokeWidth={2} markerEnd="url(#cd-arrow)" />
        <text x={572} y={66} className="fill-accent-deep text-[12px]">δ σ</text>
        {BOX.map((b) => (
          <g key={b.id}>
            <rect x={b.x} y={120} width={140} height={76} rx={3} fill={b.id === "S" ? "#2468b3" : "#0b2d4f"} />
            <text x={b.x + 70} y={166} textAnchor="middle" className="fill-paper font-serif text-[30px] italic">
              {b.id}
            </text>
            <text x={b.x + 70} y={216} textAnchor="middle" className="fill-ink text-[12px]">
              {t.names[b.id]}
            </text>
            <line x1={b.x + 70} y1={224} x2={b.x + 70} y2={276} stroke="#55626f" strokeDasharray="3 3" markerEnd="url(#cd-arrow)" />
            <text x={b.x + 78} y={262} className="fill-muted text-[11px]">{t.mortality}</text>
          </g>
        ))}
        <line x1={162} y1={146} x2={246} y2={146} stroke="#2468b3" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#cd-arrow)" />
        <text x={205} y={124} textAnchor="middle" className="fill-accent-deep text-[11px]">
          <tspan x={205}>{t.fertile[0]}</tspan>
          <tspan x={205} dy={13}>{t.fertile[1]}</tspan>
        </text>
        <line x1={476} y1={146} x2={394} y2={146} stroke="#0b2d4f" strokeWidth={2} markerEnd="url(#cd-arrow)" />
        <text x={435} y={124} textAnchor="middle" className="fill-ink text-[11px]">
          <tspan x={435}>{t.matings[0]}</tspan>
          <tspan x={435} dy={13}>{t.matings[1]}</tspan>
        </text>
        <line x1={392} y1={180} x2={476} y2={180} stroke="#0b2d4f" strokeWidth={1.5} markerEnd="url(#cd-arrow)" />
        <text x={435} y={198} textAnchor="middle" className="fill-ink text-[11px]">{t.birthsM}</text>
        <path d="M300 120 C 300 92, 340 92, 340 118" fill="none" stroke="#0b2d4f" strokeWidth={1.5} markerEnd="url(#cd-arrow)" />
        <text x={346} y={102} className="fill-ink text-[11px]">{t.birthsF}</text>
      </svg>
    </figure>
  );
}
