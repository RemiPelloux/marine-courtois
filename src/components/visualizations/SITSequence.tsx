"use client";

import { a11y } from "@/i18n";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { simulateRF } from "@/lib/scientific/residual-fertility";
import { LineChart } from "@/components/visualizations/LineChart";
import { IconButton } from "@/components/interactions/Controls";
import { mulberry32 } from "@/lib/utils/random";
import { cn } from "@/lib/utils/cn";

/**
 * Lab module 2 — the principle of SIT as a five-step visual sequence.
 * Steps 1–4 are a schematic (illustrative individuals); step 5 uses the
 * residual-fertility model to show that the outcome depends on mechanisms.
 */
const STEPS = [
  {
    title: "Population sauvage",
    text: "Mâles et femelles sauvages se reproduisent : chaque accouplement peut produire une descendance.",
  },
  {
    title: "Lâcher de mâles stériles",
    text: "Des mâles élevés et stérilisés sont relâchés. Ils ne produisent pas de descendance viable.",
  },
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
    text: "L'issue n'est pas garantie : elle dépend de l'intensité des lâchers et de mécanismes comme la fertilité résiduelle.",
  },
];

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

export function SITSequence() {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const pts = useMemo(() => individuals(step), [step]);
  const traj = useMemo(() => {
    const o = { tEnd: 300, dt: 0.1, sampleEvery: 3 };
    const p = (sigma: number, delta = 0) => simulateRF({ sigma, delta }, o).states.map((s, i) => [i * 3, s[1]] as [number, number]);
    return { none: p(0), low: p(150), high: p(2000), rf: p(2000, 0.01) };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <ol className="space-y-1 lg:col-span-4" aria-label={a11y.etapes}>
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => setStep(i)}
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
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mb-5 max-w-2xl text-[1.02rem] leading-relaxed" aria-live="polite">
              <span className="tabular-nums text-xs text-accent-deep">Étape {step + 1}/5 · </span>
              {STEPS[step].text}
            </p>
            {step < 4 ? (
              <svg viewBox="0 0 400 200" className="h-auto w-full rounded-[3px] border border-rule bg-stone/50" role="img" aria-label={`Schéma, étape ${step + 1} : ${STEPS[step].title}.`}>
                {step === 2 &&
                  pts
                    .filter((p) => p.kind === "F")
                    .map((f, i) => {
                      const partner = pts[(i * 7 + 18) % pts.length];
                      return <path key={i} d={`M${f.x},${f.y}L${partner.x},${partner.y}`} stroke="#0f1d2e" strokeOpacity={0.25} strokeDasharray="2 3" />;
                    })}
                {pts.map((p, i) => (
                  <g key={i} transform={`translate(${p.x},${p.y})`}>
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
                  </g>
                ))}
              </svg>
            ) : (
              <div>
                <LineChart
                  height={300}
                  series={[
                    { id: "n", label: "Sans lâchers", points: traj.none, color: "#6b7785", dash: "2 4", width: 1.5 },
                    { id: "l", label: "Lâchers faibles", points: traj.low, color: "#0f1d2e", dash: "6 4", width: 1.8 },
                    { id: "h", label: "Lâchers forts", points: traj.high, color: "#0f1d2e", width: 2 },
                    { id: "r", label: "Lâchers forts + 1 % de mâles fertiles", points: traj.rf, color: "#2468b3", width: 2.4 },
                  ]}
                  xDomain={[0, 300]}
                  yDomain={[0, 1050]}
                  xLabel="temps (jours)"
                  yLabel="femelles sauvages"
                  summary="Quatre trajectoires du modèle de fertilité résiduelle : sans lâchers la population reste stable ; des lâchers faibles la réduisent partiellement ; des lâchers forts l'éliminent ; avec 1 % de mâles relâchés fertiles, elle se stabilise à un niveau réduit."
                />
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink/75">
                  <li>— — sans lâchers</li>
                  <li>- - - lâchers faibles (σ = 150/j)</li>
                  <li>—— lâchers forts (σ = 2 000/j)</li>
                  <li className="text-accent-deep">—— lâchers forts + 1 % de mâles fertiles</li>
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-4 text-xs text-ink/75" aria-label={a11y.legendeDuSchema}>
            <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-ink" /> mâle sauvage</li>
            <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-accent" /> mâle stérile</li>
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-full border-[1.5px] border-ink bg-paper" /> femelle</li>
            <li className="flex items-center gap-1.5"><span className="size-3 rounded-full border-[1.5px] border-accent bg-paper" /> accouplée à un mâle stérile</li>
          </ul>
          <div className="flex gap-2">
            <IconButton onClick={() => setStep((s) => Math.max(0, s - 1))} label="Étape précédente">
              <ArrowLeft className="size-4" aria-hidden />
            </IconButton>
            <IconButton onClick={() => setStep((s) => Math.min(4, s + 1))} variant="solid" label="Étape suivante">
              <ArrowRight className="size-4" aria-hidden />
            </IconButton>
          </div>
        </div>
        <p className="mono-meta mt-4 text-muted">
          Étapes 1–4 : schéma illustratif. Étape 5 : modèle de fertilité résiduelle (Courtois et al., 2025), paramètres du notebook public.
        </p>
      </div>
    </div>
  );
}
