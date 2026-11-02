"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { simulateRF } from "@/lib/scientific/residual-fertility";
import { LineChart } from "@/components/visualizations/LineChart";
import { IconButton } from "@/components/interactions/Controls";
import { mulberry32 } from "@/lib/utils/random";
import { cn } from "@/lib/utils/cn";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { numberFormats } from "@/lib/utils/format";

/**
 * Lab module 2 — the principle of SIT as a five-step visual sequence.
 * Steps 1–4 are a schematic (illustrative individuals); step 5 uses the
 * residual-fertility model to show that the outcome depends on mechanisms.
 */
const COPY = copy({
  fr: {
    steps: [
      { title: "Population sauvage", text: "Mâles et femelles sauvages se reproduisent : chaque accouplement peut produire une descendance." },
      { title: "Lâcher de mâles stériles", text: "Des mâles élevés et stérilisés sont relâchés. Ils ne produisent pas de descendance viable." },
      {
        title: "Compétition pour l'accouplement",
        text: "Mâles sauvages et stériles entrent en compétition. Les mâles stériles peuvent être moins compétitifs (paramètre η).",
      },
      {
        title: "Modification de la reproduction",
        text: "Une femelle accouplée à un mâle stérile ne pond pas d'œufs viables — sauf fertilité résiduelle, ou ré-accouplement avec un mâle fertile.",
      },
      {
        title: "Trajectoire de la population",
        text: "L'issue n'est pas garantie : elle dépend de l'intensité des lâchers et de mécanismes comme la fertilité résiduelle.",
      },
    ],
    step: (i: number) => `Étape ${i}/5 · `,
    schematic: (i: number, title: string) => `Schéma, étape ${i} : ${title}.`,
    series: ["Sans lâchers", "Lâchers faibles", "Lâchers forts", "Lâchers forts + 1 % de mâles fertiles"],
    legend: (low: string, high: string) => ["— — sans lâchers", `- - - lâchers faibles (σ = ${low}/j)`, `—— lâchers forts (σ = ${high}/j)`, "—— lâchers forts + 1 % de mâles fertiles"],
    x: "temps (jours)",
    y: "femelles sauvages",
    summary:
      "Quatre trajectoires du modèle de fertilité résiduelle : sans lâchers la population reste stable ; des lâchers faibles la réduisent partiellement ; des lâchers forts l'éliminent ; avec 1 % de mâles relâchés fertiles, elle se stabilise à un niveau réduit.",
    marks: ["mâle sauvage", "mâle stérile", "femelle", "accouplée à un mâle stérile"],
    previous: "Étape précédente",
    next: "Étape suivante",
    note: "Étapes 1–4 : schéma illustratif. Étape 5 : modèle de fertilité résiduelle (Courtois et al., 2025), paramètres du notebook public.",
  },
  en: {
    steps: [
      { title: "Wild population", text: "Wild males and females breed: each mating can produce offspring." },
      { title: "Release of sterile males", text: "Reared, sterilised males are released. They produce no viable offspring." },
      { title: "Competition for mating", text: "Wild and sterile males compete. Sterile males can be less competitive (parameter η)." },
      {
        title: "Altered reproduction",
        text: "A female mated with a sterile male lays no viable eggs — unless there is residual fertility, or she remates with a fertile male.",
      },
      {
        title: "Population trajectory",
        text: "The outcome is not guaranteed: it depends on release intensity and on mechanisms such as residual fertility.",
      },
    ],
    step: (i: number) => `Step ${i}/5 · `,
    schematic: (i: number, title: string) => `Diagram, step ${i}: ${title}.`,
    series: ["No releases", "Low releases", "High releases", "High releases + 1% fertile males"],
    legend: (low: string, high: string) => ["— — no releases", `- - - low releases (σ = ${low}/day)`, `—— high releases (σ = ${high}/day)`, "—— high releases + 1% fertile males"],
    x: "time (days)",
    y: "wild females",
    summary:
      "Four trajectories of the residual-fertility model: without releases the population stays stable; low releases reduce it partly; high releases eliminate it; with 1% of released males fertile, it settles at a reduced level.",
    marks: ["wild male", "sterile male", "female", "mated with a sterile male"],
    previous: "Previous step",
    next: "Next step",
    note: "Steps 1–4: illustrative diagram. Step 5: residual-fertility model (Courtois et al., 2025), parameters from the public notebook.",
  },
});
type Text = (typeof COPY)["fr"];

type Ind = { x: number; y: number; kind: "M" | "F" | "S"; mated?: "fertile" | "sterile" };

function individuals(step: number): Ind[] {
  const rand = mulberry32(42);
  const pts: Ind[] = [];
  for (let i = 0; i < 18; i++) pts.push({ x: 20 + rand() * 360, y: 20 + rand() * 160, kind: i % 2 ? "F" : "M" });
  if (step >= 1) for (let i = 0; i < 26; i++) pts.push({ x: 20 + rand() * 360, y: 20 + rand() * 160, kind: "S" });
  if (step >= 3) {
    let k = 0;
    for (const p of pts) {
      if (p.kind === "F") {
        p.mated = k % 3 === 0 ? "fertile" : "sterile";
        k++;
      }
    }
  }
  return pts;
}

type Trajectory = [number, number][];

function residualTrajectories() {
  const o = { tEnd: 300, dt: 0.1, sampleEvery: 3 };
  const p = (sigma: number, delta = 0) => simulateRF({ sigma, delta }, o).states.map((s, i) => [i * 3, s[1]] as [number, number]);
  return { none: p(0), low: p(150), high: p(2000), rf: p(2000, 0.01) };
}

export function SITSequence() {
  const t = COPY[useLang()];
  const [step, setStep] = useState(0);
  const traj = useMemo(() => residualTrajectories(), []);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <StepList step={step} onSelect={setStep} t={t} />
      <div className="lg:col-span-8">
        <StepPanel step={step} traj={traj} t={t} />
        <SequenceFooter onStep={setStep} t={t} />
      </div>
    </div>
  );
}

function StepPanel({ step, traj, t }: { step: number; traj: ReturnType<typeof residualTrajectories>; t: Text }) {
  const reduce = usePrefersReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="mb-5 max-w-2xl text-base leading-relaxed" aria-live="polite">
          <span className="tabular-nums text-xs text-accent-deep">{t.step(step + 1)}</span>
          {t.steps[step].text}
        </p>
        {step < 4 ? <Schematic step={step} label={t.schematic(step + 1, t.steps[step].title)} /> : <TrajectoryFigure traj={traj} t={t} />}
      </motion.div>
    </AnimatePresence>
  );
}

function StepList({ step, onSelect, t }: { step: number; onSelect: (i: number) => void; t: Text }) {
  const a11y = useA11y();
  return (
    <ol className="space-y-1 lg:col-span-4" aria-label={a11y.etapes}>
      {t.steps.map((s, i) => (
        <li key={s.title}>
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "flex w-full items-baseline gap-4 border-l-2 py-2.5 pl-4 text-left transition-colors",
              i === step ? "border-accent text-ink" : "border-rule text-ink/75 hover:text-ink",
            )}
          >
            <span className="tabular-nums text-xs">{i + 1}</span>
            <span className="font-serif text-xl">{s.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Schematic({ step, label }: { step: number; label: string }) {
  const pts = useMemo(() => individuals(step), [step]);
  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full rounded-[3px] border border-rule bg-stone/50" role="img" aria-label={label}>
      {step === 2 &&
        pts
          .filter((p) => p.kind === "F")
          .map((f, i) => {
            const partner = pts[(i * 7 + 18) % pts.length];
            return <path key={i} d={`M${f.x},${f.y}L${partner.x},${partner.y}`} stroke="#0f1d2e" strokeOpacity={0.25} strokeDasharray="2 3" />;
          })}
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y})`}>
          <IndividualMark ind={p} />
        </g>
      ))}
    </svg>
  );
}

function IndividualMark({ ind: p }: { ind: Ind }) {
  return (
    <>
      {p.kind === "M" && <circle r={4.5} fill="#0f1d2e" />}
      {p.kind === "S" && <circle r={4.5} fill="#2468b3" />}
      {p.kind === "F" && (
        <circle
          r={5.5}
          fill={p.mated === "fertile" ? "#0f1d2e" : p.mated === "sterile" ? "#f5f2eb" : "#f5f2eb"}
          stroke={p.mated === "sterile" ? "#2468b3" : "#0f1d2e"}
          strokeWidth={1.6}
        />
      )}
    </>
  );
}

function TrajectoryFigure({ traj, t }: { traj: Record<"none" | "low" | "high" | "rf", Trajectory>; t: Text }) {
  const { nf } = numberFormats(useLang());
  return (
    <div>
      <LineChart
        height={300}
        series={[
          { id: "n", label: t.series[0], points: traj.none, color: "#6b7785", dash: "2 4", width: 1.5 },
          { id: "l", label: t.series[1], points: traj.low, color: "#0f1d2e", dash: "6 4", width: 1.8 },
          { id: "h", label: t.series[2], points: traj.high, color: "#0f1d2e", width: 2 },
          { id: "r", label: t.series[3], points: traj.rf, color: "#2468b3", width: 2.4 },
        ]}
        xDomain={[0, 300]}
        yDomain={[0, 1050]}
        xLabel={t.x}
        yLabel={t.y}
        summary={t.summary}
      />
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink/75">
        {t.legend(nf.format(150), nf.format(2000)).map((line, i) => (
          <li key={line} className={i === 3 ? "text-accent-deep" : undefined}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

const MARK_CLASS = [
  "size-2.5 rounded-full bg-ink",
  "size-2.5 rounded-full bg-accent",
  "size-3 rounded-full border-[1.5px] border-ink bg-paper",
  "size-3 rounded-full border-[1.5px] border-accent bg-paper",
];

function SequenceFooter({ onStep, t }: { onStep: Dispatch<SetStateAction<number>>; t: Text }) {
  const a11y = useA11y();
  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-4 text-xs text-ink/75" aria-label={a11y.legendeDuSchema}>
          {t.marks.map((m, i) => (
            <li key={m} className="flex items-center gap-1.5">
              <span className={MARK_CLASS[i]} /> {m}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <IconButton onClick={() => onStep((s) => Math.max(0, s - 1))} label={t.previous}>
            <ArrowLeft className="size-4" aria-hidden />
          </IconButton>
          <IconButton onClick={() => onStep((s) => Math.min(4, s + 1))} variant="solid" label={t.next}>
            <ArrowRight className="size-4" aria-hidden />
          </IconButton>
        </div>
      </div>
      <p className="mono-meta mt-4 text-muted">{t.note}</p>
    </>
  );
}
