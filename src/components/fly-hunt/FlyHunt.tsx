"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { usePlayOnce } from "@/hooks/usePlayOnce";
import { Fly } from "@/components/fly-hunt/Fly";
import { FruitShape, Ground, Leaves } from "@/components/fly-hunt/Tree";
import { HuntLevels, HuntStatus, HUNT_COPY, WantedCard } from "@/components/fly-hunt/HuntControls";
import { buildScene, LEVELS, VIEW, type FlyPos, type Level, type Scene } from "@/components/fly-hunt/scene";
import { useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";

/** Seconds since the first click, frozen once the game is over. */
function useClock(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return seconds;
}

function useHunt(level: Level, seed: number) {
  const scene = useMemo(() => buildScene(seed, level), [seed, level]);
  const [found, setFound] = useState<number[]>([]);
  const [hops, setHops] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const misses = Object.values(hops).reduce((a, b) => a + b, 0);
  const over = revealed || found.length === level.find;
  const seconds = useClock(!over && found.length + misses > 0);

  const pick = (e: MouseEvent<SVGSVGElement>) => {
    const id = Number((e.target as Element).closest("[data-fly]")?.getAttribute("data-fly"));
    const fly = scene.flies[id];
    if (over || !fly || found.includes(id)) return;
    if (fly.kind === "sterile") setFound((f) => [...f, id]);
    else setHops((h) => ({ ...h, [id]: (h[id] ?? 0) + 1 }));
  };
  return { scene, found, hops, revealed, over, misses, seconds, pick, reveal: () => setRevealed(true) };
}

type Hunt = ReturnType<typeof useHunt>;

/** Flies and fruit share one layer, shuffled in depth, so a fruit sometimes hides part of a fly. */
function Foliage({ scene, hops }: { scene: Scene; hops: Record<number, number> }) {
  const items = [...scene.fruits.map((f) => ({ z: f.z, fruit: f })), ...scene.flies.map((f) => ({ z: f.z, fly: f }))].sort((a, b) => a.z - b.z);
  return items.map((it, i) =>
    "fly" in it ? <Fly key={`f${it.fly.id}`} fly={it.fly} hop={hops[it.fly.id] ?? 0} /> : <FruitShape key={`o${i}`} fruit={it.fruit} />,
  );
}

function Ring({ fly, missed }: { fly: FlyPos; missed: boolean }) {
  const r = 40 * fly.s;
  return (
    <g transform={`translate(${fly.x} ${fly.y - 6 * fly.s})`} pointerEvents="none" fill="none">
      <circle r={r} stroke="#fbf7f2" strokeWidth="7" />
      <circle r={r} pathLength={1} className="fh-ring" stroke={missed ? "#0f1d2e" : "#1e7a34"} strokeWidth="4" strokeDasharray={missed ? "0.04 0.03" : "1"} />
    </g>
  );
}

/** On phones the tree keeps a playable size and pans sideways. */
function HuntBoard({ hunt, className }: { hunt: Hunt; className?: string }) {
  const t = HUNT_COPY[useLang()];
  const { scene, found, hops, revealed, pick } = hunt;
  const ringed = scene.flies.filter((f) => f.kind === "sterile" && (revealed || found.includes(f.id)));
  return (
    <div className="relative">
      <WantedCard />
      <div className="border-ink/15 overflow-x-auto rounded-[3px] border">
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          onClick={pick}
          role="img"
          aria-label={t.scene}
          className={cn("fh-board block h-auto w-full min-w-[44rem]", className)}
        >
          <Ground scene={scene} />
          <Foliage scene={scene} hops={hops} />
          <Leaves leaves={scene.front} />
          {ringed.map((f) => (
            <Ring key={f.id} fly={f} missed={!found.includes(f.id)} />
          ))}
        </svg>
      </div>
    </div>
  );
}

/** One game: remounted for every new tree, so its score and clock start from zero. */
function HuntGame({ level, seed, onRestart }: { level: Level; seed: number; onRestart: () => void }) {
  const t = HUNT_COPY[useLang()];
  const { ref, play } = usePlayOnce<HTMLDivElement>(0.4);
  const hunt = useHunt(level, seed);
  return (
    <div ref={ref} className="space-y-4">
      <HuntBoard hunt={hunt} className={cn(play && "fh-buzz", hunt.over && "fh-over")} />
      <HuntStatus level={level} hunt={hunt} actions={{ reveal: hunt.reveal, restart: onRestart }} />
      {hunt.over && <p className="text-note max-w-2xl leading-relaxed">{t.done}</p>}
    </div>
  );
}

/**
 * Find the released sterile males in an orange tree full of wild flies, after
 * the drawings of the thesis defence. Three levels: fewer sterile males, more
 * wild flies, more look-alikes.
 */
export function FlyHunt() {
  const t = HUNT_COPY[useLang()];
  const [levelIndex, setLevelIndex] = useState(0);
  const [seed, setSeed] = useState(1);
  const level = LEVELS[levelIndex];
  return (
    <div className="space-y-4">
      <div>
        <p className="label text-accent-deep">{t.kicker}</p>
        <p className="text-note mt-1 max-w-2xl leading-relaxed">{t.task(level.find, level.flies - level.find)}</p>
      </div>
      <HuntLevels current={levelIndex} onPick={setLevelIndex} />
      <HuntGame key={`${levelIndex}-${seed}`} level={level} seed={seed} onRestart={() => setSeed((s) => s + 1)} />
    </div>
  );
}
