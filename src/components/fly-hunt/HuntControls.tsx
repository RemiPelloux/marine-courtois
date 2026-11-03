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
    task: (find: number, wild: number) =>
      `${find === 1 ? "Un seul mâle stérile se cache" : `${find} mâles stériles se cachent`} dans cet oranger, parmi ${wild} mouches sauvages. Il porte un pull rayé rouge et blanc et un bonnet rouge et blanc. Méfiez-vous des sosies : bonnet sans le pull, pull sans le bonnet, rayures roses ou orange, bonnet bleu, pull rouge uni.`,
    scene: "Un oranger couvert de mouches en pull violet ; des mâles stériles en pull rayé rouge et blanc, coiffés d'un bonnet, s'y cachent.",
    levels: "Niveau de difficulté",
    wanted: "À trouver",
    wantedAlt: "Le mâle stérile à trouver : pull rayé rouge et blanc, bonnet rouge et blanc à pompon.",
    level: (i: number) => `Niveau ${i + 1}`,
    ratio: (n: number) => `1 stérile pour ${n} sauvages`,
    count: (n: number, total: number) => `${n} sur ${total} trouvé${n > 1 ? "s" : ""}`,
    misses: (n: number) => (n === 0 ? "aucune erreur" : `${n} erreur${n > 1 ? "s" : ""}`),
    reveal: "Montrer la réponse",
    again: "Nouvel arbre",
    done: "Plus les mâles stériles sont rares parmi les sauvages, plus il est difficile de tomber sur eux, pour vous comme pour les femelles sauvages. Dans la technique de l'insecte stérile, on lâche donc bien plus de mâles stériles qu'il n'y a de mâles sauvages, pour qu'ils s'accouplent avec les femelles, dont les œufs ne se développeront pas. Encore faut-il qu'ils soient vraiment stériles et assez compétitifs : ce sont ces limites que la thèse examine.",
  },
  en: {
    kicker: "Your turn",
    task: (find: number, wild: number) =>
      `${find === 1 ? "A single sterile male is hiding" : `${find} sterile males are hiding`} in this orange tree among ${wild} wild flies. It wears a red and white striped jumper and a red and white bobble hat. Beware of look-alikes: the hat without the jumper, the jumper without the hat, pink or orange stripes, a blue hat, a plain red jumper.`,
    scene: "An orange tree covered in flies in purple jumpers; sterile males in red and white stripes and a bobble hat are hiding among them.",
    levels: "Difficulty",
    wanted: "Find him",
    wantedAlt: "The sterile male to find: red and white striped jumper, red and white bobble hat.",
    level: (i: number) => `Level ${i + 1}`,
    ratio: (n: number) => `1 sterile for ${n} wild`,
    count: (n: number, total: number) => `${n} of ${total} found`,
    misses: (n: number) => (n === 0 ? "no mistakes" : `${n} mistake${n > 1 ? "s" : ""}`),
    reveal: "Show the answer",
    again: "New tree",
    done: "The rarer the sterile males are among the wild ones, the harder they are to come across, for you as for wild females. In the sterile insect technique, far more sterile males are therefore released than there are wild males, to mate with the females, whose eggs will then not develop. They still have to be truly sterile and compete well: these are the limits the thesis examines.",
  },
});

const BUTTON = "inline-flex min-h-10 items-center rounded-[3px] border px-3 text-sm transition-colors";

/** The fly to find, pinned in the corner of the tree like a wanted poster; it does not scroll with the tree on phones. */
export function WantedCard() {
  const t = HUNT_COPY[useLang()];
  return (
    <figure className="border-ink/20 bg-paper pointer-events-none absolute top-2 left-2 z-10 w-18 rounded-[3px] border px-1.5 pt-1.5 pb-1 text-center shadow-[0_6px_16px_-8px_rgba(15,29,46,0.4)] sm:w-20">
      <Image src="/figures/fly/sterile.webp" alt={t.wantedAlt} width={183} height={240} className="mx-auto h-auto w-full" />
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
