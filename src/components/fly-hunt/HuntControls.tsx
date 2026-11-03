"use client";

import Image from "next/image";
import { LEVELS } from "@/components/fly-hunt/scene";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const HUNT_COPY = copy({
  fr: {
    kicker: "À vous de jouer",
    task: (sterile: number) =>
      `Vous êtes une femelle. Pour avoir des petits, il vous faut le mâle sauvage, en pull rayé rouge et blanc. Autour de lui, ${sterile} mâles stériles lâchés, en pull rose\u00a0: on marque les stériles en rose pour les reconnaître.`,
    scene: "Un oranger rempli de mâles stériles en pull rose ; un mâle sauvage en pull rayé rouge et blanc, coiffé d'un bonnet, s'y cache.",
    levels: "Taille du lâcher",
    wanted: "À trouver",
    stamp: "Trouvé",
    wantedAlt: "Le mâle sauvage à trouver\u00a0: pull rayé rouge et blanc, bonnet rouge et blanc à pompon.",
    level: (i: number) => ["Petit lâcher", "Lâcher moyen", "Grand lâcher"][i],
    ratio: (n: number) => `1 sauvage pour ${n} stériles`,
    status: (found: boolean): string => (found ? "Mâle sauvage trouvé" : "Pas encore trouvé"),
    misses: (n: number) => (n === 0 ? "aucune erreur" : `${n} erreur${n > 1 ? "s" : ""}`),
    reveal: "Montrer la réponse",
    again: "Nouvel arbre",
    done: "C'est le principe de la technique de l'insecte stérile\u00a0: plus on lâche de mâles stériles, plus le mâle sauvage est difficile à trouver pour les femelles, et la plupart de leurs accouplements ne donnent aucune descendance. Encore faut-il que les mâles lâchés soient vraiment stériles et assez compétitifs face aux sauvages\u00a0: ce sont ces limites que la thèse examine.",
  },
  en: {
    kicker: "Your turn",
    task: (sterile: number) =>
      `You are a female. To have offspring, you need the wild male, in a red and white striped jumper. Around him are ${sterile} released sterile males in pink jumpers: sterile males are marked pink so they can be told apart.`,
    scene: "An orange tree filled with sterile males in pink jumpers; one wild male in red and white stripes and a bobble hat is hiding among them.",
    levels: "Release size",
    wanted: "Find him",
    stamp: "Found",
    wantedAlt: "The wild male to find: red and white striped jumper, red and white bobble hat.",
    level: (i: number) => ["Small release", "Medium release", "Large release"][i],
    ratio: (n: number) => `1 wild for ${n} sterile`,
    status: (found: boolean) => (found ? "Wild male found" : "Not found yet"),
    misses: (n: number) => (n === 0 ? "no mistakes" : `${n} mistake${n > 1 ? "s" : ""}`),
    reveal: "Show the answer",
    again: "New tree",
    done: "That is the principle of the sterile insect technique: the more sterile males are released, the harder the wild male is for females to find, and most of their matings produce no offspring. The released males still have to be truly sterile and compete well with the wild ones: these are the limits the thesis examines.",
  },
});

const BUTTON = "inline-flex min-h-10 items-center rounded-[3px] border px-3 text-sm transition-colors";

/**
 * The fly to find, pinned in the corner of the tree like a wanted poster; it does
 * not scroll with the tree on phones. Once he is found, a "found" stamp lands on it.
 */
export function WantedCard({ found }: { found: boolean }) {
  const t = HUNT_COPY[useLang()];
  return (
    <figure className="fh-card border-ink/20 bg-paper pointer-events-none absolute top-2 left-2 z-10 w-18 -rotate-2 rounded-[3px] border px-1.5 pt-1.5 pb-1 text-center shadow-[0_6px_16px_-8px_rgba(15,29,46,0.4)] sm:w-20">
      <Image src="/figures/fly/wild.webp" alt={t.wantedAlt} width={183} height={240} className="mx-auto h-auto w-full" />
      <figcaption className="mt-0.5 text-xs leading-tight whitespace-nowrap">{t.wanted}</figcaption>
      {found && (
        <span className="fh-stamp bg-paper/90 absolute inset-x-0 top-[38%] mx-auto w-fit -rotate-12 rounded-[3px] border-2 border-[#1e7a34] px-1.5 text-xs font-semibold text-[#1e7a34]">
          {t.stamp}
        </span>
      )}
    </figure>
  );
}

export function HuntLevels({ current, onPick }: { current: number; onPick: (i: number) => void }) {
  const t = HUNT_COPY[useLang()];
  return (
    <div role="group" aria-label={t.levels} className="flex flex-wrap gap-2">
      {LEVELS.map((l, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={i === current}
          onClick={() => onPick(i)}
          className={cn(BUTTON, "flex-col items-start py-1.5 text-left", i === current ? "border-ink bg-ink text-paper" : "border-ink/50 hover:border-ink")}
        >
          <span>{t.level(i)}</span>
          <span className={cn("text-xs", i === current ? "text-paper/75" : "text-muted")}>{t.ratio(l.sterile)}</span>
        </button>
      ))}
    </div>
  );
}

type Score = { found: number[]; misses: number; seconds: number; over: boolean };
type StatusProps = { hunt: Score; actions: { reveal: () => void; restart: () => void } };

/** The status is announced; the clock is not, or a screen reader would read it every second. */
export function HuntStatus({ hunt, actions }: StatusProps) {
  const t = HUNT_COPY[useLang()];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="flex flex-wrap gap-x-4 text-sm tabular-nums">
        <span aria-live="polite">{t.status(hunt.found.length > 0)}</span>
        <span className="text-muted">{clock(hunt.seconds)}</span>
        <span className="text-muted">{t.misses(hunt.misses)}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {!hunt.over && (
          <button type="button" onClick={actions.reveal} className={cn(BUTTON, "border-ink/50 hover:border-ink")}>
            {t.reveal}
          </button>
        )}
        <button type="button" onClick={actions.restart} className={cn(BUTTON, "border-ink/50 hover:border-ink")}>
          {t.again}
        </button>
      </div>
    </div>
  );
}
