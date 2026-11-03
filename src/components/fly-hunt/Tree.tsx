import type { Blob, Fruit, Scene } from "@/components/fly-hunt/scene";

/** The orange tree the flies live in: sky, meadow, trunk, foliage and fruit. Purely decorative, never catches a click. */
const MASS = ["#2f6a2b", "#3a7a31", "#47883a"];
const LEAF = ["#5c9c3e", "#6fae47", "#3f8031"];
const FRONT = ["#7ab84c", "#5f9f3f"];
/** red and white flowers too, so a patch of red is not enough to spot the wild male */
const FLOWER = ["#fbf6ee", "#f2d43a", "#e58fb0", "#d9302a"];

const TRUNK =
  "M372 500C380 450 384 400 382 330 381 300 360 272 328 252L340 240C366 256 383 276 391 298 394 262 397 232 391 200L409 200C413 236 411 268 410 296 421 270 441 252 471 240L479 253C451 266 427 292 421 330 418 400 422 450 430 500Z";

export function Ground({ scene }: { scene: Scene }) {
  return (
    <g pointerEvents="none">
      <rect width="800" height="500" fill="#dbe8ee" />
      <path d="M0 390C140 352 250 372 400 360S660 338 800 376V500H0Z" fill="#b8d398" />
      <rect y="425" width="800" height="75" fill="#8dbb4c" />
      <path d={TRUNK} fill="#7b4a2b" stroke="#4e2e1a" strokeWidth="2" />
      {scene.masses.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={MASS[m.tone]} />
      ))}
      <Leaves leaves={scene.leaves} colors={LEAF} />
      {scene.flowers.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={FLOWER[f.tone]} />
      ))}
    </g>
  );
}

export function Leaves({ leaves, colors = FRONT }: { leaves: Blob[]; colors?: string[] }) {
  return (
    <g pointerEvents="none">
      {leaves.map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx={l.r} ry={l.r * 0.45} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={colors[l.tone % colors.length]} />
      ))}
    </g>
  );
}

export function FruitShape({ fruit: f }: { fruit: Fruit }) {
  return (
    <g pointerEvents="none">
      <circle cx={f.x} cy={f.y} r={f.r} fill={f.lemon ? "#f2d43a" : "#f08a24"} stroke={f.lemon ? "#c9a91c" : "#c4651a"} strokeWidth="1.2" />
      <circle cx={f.x - f.r * 0.35} cy={f.y - f.r * 0.35} r={f.r * 0.22} fill="#fff" fillOpacity="0.45" />
      <ellipse cx={f.x + 3} cy={f.y - f.r} rx="5" ry="2.2" transform={`rotate(-30 ${f.x + 3} ${f.y - f.r})`} fill="#3f8031" />
    </g>
  );
}
