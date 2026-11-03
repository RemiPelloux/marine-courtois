import { VIEW, type FlyPos } from "@/components/fly-hunt/scene";

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

/** Release order: the highest flies land first, with a little scatter so they do not arrive in rows. */
const landingDelay = (fly: FlyPos) => `${(0.05 + (fly.y / VIEW.h) * 0.9 + fly.z * 0.35).toFixed(2)}s`;

/**
 * One fly. `.fh-land` carries the drop into the tree, `.fh-body` the hop when a
 * sterile male is picked (`hop` restarts it), `.fh-sprite` the wiggle under the pointer.
 */
export function Fly({ fly, hop }: { fly: FlyPos; hop: number }) {
  return (
    <g
      data-fly={fly.id}
      className={fly.kind === "wild" ? "fh-fly fh-target" : "fh-fly"}
      transform={`translate(${fly.x} ${fly.y}) rotate(${fly.rot}) scale(${fly.flip ? -fly.s : fly.s} ${fly.s})`}
    >
      <g className="fh-land" style={{ animationDelay: landingDelay(fly) }}>
        <g key={hop} className={hop > 0 ? "fh-body fh-hop" : "fh-body"}>
          <ellipse cx="-2" cy="-4" rx="24" ry="33" fill="transparent" />
          <image href={`/figures/fly/${fly.kind}.webp`} className="fh-sprite" {...SPRITE} />
        </g>
        {hop > 0 && <circle key={`ripple-${hop}`} className="fh-ripple" cy="-4" r="30" fill="none" stroke="#e0607e" strokeWidth="3" />}
      </g>
    </g>
  );
}
