import type { FlyPos } from "@/components/fly-hunt/scene";

/**
 * Every fly is Marine's drawing from the thesis defence (public/figures/fly).
 * The wild male to find is the original: red and white stripes, red and white
 * bobble hat. The other looks are the same drawing recoloured, or with the hat
 * taken off: the released sterile males in purple, and look-alikes that get
 * one of his two marks wrong.
 *
 * The sprite is placed so the jumper is centred 8 units below the fly's origin
 * and the whole fly stands 74 units tall before scaling.
 */
const SPRITE = { x: -34.8, y: -43.7, width: 56.3, height: 74 };

/** One fly; `hop` restarts its little jump each time it changes. */
export function Fly({ fly, hop }: { fly: FlyPos; hop: number }) {
  return (
    <g data-fly={fly.id} className="fh-fly" transform={`translate(${fly.x} ${fly.y}) rotate(${fly.rot}) scale(${fly.flip ? -fly.s : fly.s} ${fly.s})`}>
      <g key={hop} className={hop > 0 ? "fh-body fh-hop" : "fh-body"}>
        <ellipse cx="-2" cy="-4" rx="24" ry="33" fill="transparent" />
        <image href={`/figures/fly/${fly.kind}.webp`} className="fh-sprite" {...SPRITE} />
      </g>
    </g>
  );
}
