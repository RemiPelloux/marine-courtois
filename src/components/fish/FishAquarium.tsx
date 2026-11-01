"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Slider } from "@/components/interactions/Controls";
import { useAquarium } from "@/components/fish/useAquarium";
import { FISH_COLOR, GROUP_SHORT } from "@/components/fish/palette";
import { GROUPS, SCHOOL } from "@/lib/fish/sim";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { numberFormats } from "@/lib/utils/format";

const COPY = copy({
  fr: {
    illustration: "Illustration — comportements simulés, non mesurés",
    pause: "Pause",
    play: "Lecture",
    prey: "Densité de proies",
    preyHint: "Même nombre de proies pour les trois bancs",
    rate: "Captures par poisson et par minute, sur les 20 dernières secondes.",
    caption: (handling: string) =>
      `Chaque poisson repère une proie dans son rayon de recherche, la poursuit, puis s'arrête le temps de la manipuler (${handling}). Quand les proies abondent, ce temps de manipulation plafonne les captures. L'ordre des bancs reprend le résultat de l'article ; les valeurs sont illustratives.`,
  },
  en: {
    illustration: "Illustration — simulated behaviour, not measured",
    pause: "Pause",
    play: "Play",
    prey: "Prey density",
    preyHint: "Same number of prey for all three schools",
    rate: "Captures per fish per minute, over the last 20 seconds.",
    caption: (handling: string) =>
      `Each fish spots a prey within its search radius, chases it, then stops for as long as it takes to handle it (${handling}). When prey are plentiful, this handling time caps the captures. The order of the schools follows the article's result; the values are illustrative.`,
  },
});

/**
 * Signature experience of axis B. Three schools of fish hunt the same prey;
 * after each capture a fish pauses to handle its prey. Raise the prey density:
 * captures climb, then level off — the shape of a functional response.
 * Illustrative: behaviours are scripted, not fitted to the data.
 */
export function FishAquarium({ className }: { className?: string }) {
  const lang = useLang();
  const a11y = useA11y();
  const t = COPY[lang];
  const { nf1 } = numberFormats(lang);
  const [prey, setPrey] = useState(30);
  const { canvasRef, rates, playing, toggle } = useAquarium(prey);
  const max = Math.max(1, ...GROUPS.map((g) => rates[g]));

  return (
    <figure className={className}>
      <div className="on-dark relative overflow-hidden bg-antibes">
        <canvas ref={canvasRef} className="block aspect-[4/3] w-full sm:aspect-[16/7]" role="img" aria-label={a11y.aquarium} />
        <span className="pointer-events-none absolute bottom-2.5 left-4 text-xs text-mist">{t.illustration}</span>
        <button
          type="button"
          onClick={toggle}
          className="absolute top-2 right-2 inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-paper/40 px-3 text-sm text-paper hover:bg-paper hover:text-antibes"
        >
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {playing ? t.pause : t.play}
        </button>
      </div>
      <div className="grid gap-6 border-x border-b border-ink/15 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:p-6">
        <Slider label={t.prey} symbol="N" value={prey} min={4} max={90} step={2} onChange={setPrey} hint={t.preyHint} />
        <ul className="space-y-2.5" aria-label={a11y.capturesParBanc}>
          {GROUPS.map((g) => (
            <li key={g} className="grid grid-cols-[minmax(0,11rem)_1fr_3.5rem] items-center gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: FISH_COLOR[g], outline: g === "ISIR" ? "1.5px solid #5b95d6" : undefined }} aria-hidden />
                {GROUP_SHORT[g][lang]}
              </span>
              <span className="h-2 bg-ink/10" aria-hidden>
                <span className="block h-full bg-antibes transition-[width] duration-500" style={{ width: `${(rates[g] / max) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums">{nf1.format(rates[g])}</span>
            </li>
          ))}
          <li className="pt-1 text-xs text-muted">{t.rate}</li>
        </ul>
      </div>
      <figcaption className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        {t.caption(GROUPS.map((g) => `${nf1.format(SCHOOL[g].handling)} s`).join(" / "))}
      </figcaption>
    </figure>
  );
}
