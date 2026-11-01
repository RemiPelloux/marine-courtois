/**
 * A discreet nod to Antibes: a ribbon of bleu Antibes with two slow swells
 * (the Mediterranean, and the oscillations the models describe) and the
 * coordinates of the old town, unnamed. Decorative only.
 */
const swell = (amp: number, period: number, y: number) => {
  // two identical halves so a -50% drift loops seamlessly
  let d = `M0 ${y}`;
  for (let x = 0; x <= 2400; x += 10) d += ` L${x} ${(y + amp * Math.sin((x / period) * Math.PI * 2)).toFixed(2)}`;
  return `${d} L2400 64 L0 64 Z`;
};

export function SeaRibbon() {
  return (
    <div className="relative h-16 overflow-hidden bg-antibes-2" aria-hidden title="43°34′51″ N · 7°07′30″ E">
      <svg className="sea-swell sea-swell--slow absolute inset-y-0 left-0 h-full w-[200%]" viewBox="0 0 2400 64" preserveAspectRatio="none">
        <path d={swell(5, 600, 30)} fill="#1d4e80" />
      </svg>
      <svg className="sea-swell absolute inset-y-0 left-0 h-full w-[200%]" viewBox="0 0 2400 64" preserveAspectRatio="none">
        <path d={swell(4, 400, 42)} fill="#0b2d4f" />
        <path d={swell(4, 400, 42).split(" L2400 64")[0]} fill="none" stroke="#8fc1ea" strokeOpacity="0.35" strokeWidth="1.2" />
      </svg>
      <span className="site-gutter absolute inset-x-0 top-2 mx-auto flex max-w-site justify-end text-xs tracking-wide text-mist/80 tabular-nums">
        43°34′ N · 7°07′ E
      </span>
    </div>
  );
}
