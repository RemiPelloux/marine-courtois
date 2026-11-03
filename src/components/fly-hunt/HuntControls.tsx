"use client";

import Image from "next/image";
import { LEVELS, type Level } from "@/components/fly-hunt/scene";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const ratio = (l: Level) => Math.round((l.flies - l.find) / l.find);

export const HUNT_COPY = copy({
  fr: {
    kicker: "À vous de jouer",
    task: (find: number, sterile: number) =>
      `Vous êtes une femelle. Pour que vos œufs se développent, trouvez ${find === 1 ? "le mâle sauvage" : `les ${find} mâles sauvages`} : pull rayé rouge et blanc, bonnet rouge et blanc. Les lâchers ont rempli l'oranger de ${sterile} mâles stériles, et certains lui ressemblent\u00a0: bonnet sans le pull, pull sans le bonnet, rayures roses ou orange, bonnet bleu, pull rouge uni.`,
    scene: "Un oranger rempli de mâles stériles en pull violet ; un mâle sauvage en pull rayé rouge et blanc, coiffé d'un bonnet, s'y cache.",
    levels: "Niveau de difficulté",
    wanted: "À trouver",
    wantedAlt: "Le mâle sauvage à trouver\u00a0: pull rayé rouge et blanc, bonnet rouge et blanc à pompon.",
    level: (i: number) => `Niveau ${i + 1}`,
    ratio: (n: number) => `1 sauvage pour ${n} stériles`,
    count: (n: number, total: number) => `${n} sur ${total} trouvé${n > 1 ? "s" : ""}`,
    misses: (n: number) => (n === 0 ? "aucune erreur" : `${n} erreur${n > 1 ? "s" : ""}`),
    reveal: "Montrer la réponse",
    again: "Nouvel arbre",
    done: "C'est tout l'enjeu de la technique de l'insecte stérile. En lâchant bien plus de mâles stériles qu'il n'y a de mâles sauvages, on rend le mâle sauvage difficile à trouver pour les femelles, et la plupart de leurs accouplements ne donnent aucune descendance. Encore faut-il que les mâles lâchés soient vraiment stériles et assez compétitifs face aux sauvages\u00a0: ce sont ces limites que la thèse examine.",
  },
  en: {
    kicker: "Your turn",
    task: (find: number, sterile: number) =>
      `You are a female. For your eggs to develop, find ${find === 1 ? "the wild male" : `the ${find} wild males`}: red and white striped jumper, red and white bobble hat. Releases have filled the orange tree with ${sterile} sterile males, and some look like him: the hat without the jumper, the jumper without the hat, pink or orange stripes, a blue hat, a plain red jumper.`,
    scene: "An orange tree filled with sterile males in purple jumpers; one wild male in red and white stripes and a bobble hat is hiding among them.",
    levels: "Difficulty",
    wanted: "Find him",
    wantedAlt: "The wild male to find: red and white striped jumper, red and white bobble hat.",
    level: (i: number) => `Level ${i + 1}`,
    ratio: (n: number) => `1 wild for ${n} sterile`,
    count: (n: number, total: number) => `${n} of ${total} found`,
    misses: (n: number) => (n === 0 ? "no mistakes" : `${n} mistake${n > 1 ? "s" : ""}`),
    reveal: "Show the answer",
    again: "New tree",
    done: "That is the whole point of the sterile insect technique. By releasing far more sterile males than there are wild ones, the wild male becomes hard for females to find, and most of their matings produce no offspring. The released males still have to be truly sterile and compete well with the wild ones: these are the limits the thesis examines.",
  },
});

const BUTTON = "inline-flex min-h-10 items-center rounded-[3px] border px-3 text-sm transition-colors";

/** The fly to find, pinned in the corner of the tree like a wanted poster; it does not scroll with the tree on phones. */
export function WantedCard() {
  const t = HUNT_COPY[useLang()];
  return (
    <figure className="border-ink/20 bg-paper pointer-events-none absolute top-2 left-2 z-10 w-18 rounded-[3px] border px-1.5 pt-1.5 pb-1 text-center shadow-[0_6px_16px_-8px_rgba(15,29,46,0.4)] sm:w-20">
      <Image src="/figures/fly/wild.webp" alt={t.wantedAlt} width={183} height={240} className="mx-auto h-auto w-full" />
      <figcaption className="mt-0.5 text-xs leading-tight whitespace-nowrap">{t.wanted}</figcaption>
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
          <span className={cn("text-xs", i === current ? "text-paper/75" : "text-muted")}>{t.ratio(ratio(l))}</span>
        </button>
      ))}
    </div>
  );
}

type Score = { found: number[]; misses: number; seconds: number; over: boolean };
type StatusProps = { level: Level; hunt: Score; actions: { reveal: () => void; restart: () => void } };

/** The count is announced; the clock is not, or a screen reader would read it every second. */
export function HuntStatus({ level, hunt, actions }: StatusProps) {
  const t = HUNT_COPY[useLang()];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="flex flex-wrap gap-x-4 text-sm tabular-nums">
        <span aria-live="polite">{t.count(hunt.found.length, level.find)}</span>
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
