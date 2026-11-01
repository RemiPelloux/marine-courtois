import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MILESTONE_KIND_LABEL, type Milestone } from "@/data/milestones";
import { formatDateFr } from "@/lib/utils/format";
import { AXIS_YEARS, FILM_TYPE, INTRO, MOVE, STEP, axisX, filmCursor, reachedCount, type FilmVariant } from "./layout";

export type CareerFilmProps = { milestones: Milestone[]; variant: FilmVariant };

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT } as const;

/** The career film: a playhead travels a 2022–2026 axis and stops on each verified milestone. */
export function CareerFilm({ milestones, variant }: CareerFilmProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const type = FILM_TYPE[variant];
  const axisY = height * type.axisY;
  const geo = { width, axisY, pad: type.pad };
  return (
    <AbsoluteFill className="bg-botanical text-paper">
      <Caption milestones={milestones} variant={variant} />
      <svg width={width} height={height} className="absolute inset-0" aria-hidden>
        <Axis frame={frame} {...geo} meta={type.meta} />
        {milestones.map((m, i) => (
          <Dot key={m.id} m={m} i={i} frame={frame} count={milestones.length} geo={{ ...geo, axisY: axisY - sameDateBefore(milestones, i) * DOT_STACK }} />
        ))}
        <Playhead frame={frame} milestones={milestones} geo={geo} />
      </svg>
    </AbsoluteFill>
  );
}

type Geo = { width: number; axisY: number; pad: number };

/** Vertical offset between milestones that share a month, so their dots never overlap. */
const DOT_STACK = 26;
const sameDateBefore = (ms: Milestone[], i: number) => ms.slice(0, i).filter((o) => o.date === ms[i].date).length;

function Axis({ frame, width, axisY, pad, meta }: Geo & { frame: number; meta: number }) {
  const drawn = interpolate(frame, [0, INTRO - 6], [0, 1], clampOpts);
  return (
    <g>
      <line x1={pad} x2={pad + (width - pad * 2) * drawn} y1={axisY} y2={axisY} className="stroke-paper/45" strokeWidth={2} />
      {AXIS_YEARS.map((y, i) => {
        const x = axisX(y, width, pad);
        const o = interpolate(frame, [8 + i * 5, 22 + i * 5], [0, 1], clampOpts);
        return (
          <g key={y} opacity={o}>
            <line x1={x} x2={x} y1={axisY - 10} y2={axisY + 10} className="stroke-paper/45" strokeWidth={1.5} />
            <text x={x} y={axisY + 18 + meta * 1.4} textAnchor="middle" fontSize={meta} className="fill-mist font-sans tabular-nums">
              {y}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Dot({ m, i, frame, count, geo }: { m: Milestone; i: number; frame: number; count: number; geo: Geo }) {
  const { fps } = useVideoConfig();
  const arrival = INTRO + i * STEP + MOVE;
  const pop = spring({ frame: frame - arrival + 2, fps, config: { damping: 14, stiffness: 160 } });
  const cursor = filmCursor(frame, count);
  const active = !cursor.done && cursor.index === i && reachedCount(frame, count) === i + 1;
  const strong = m.kind === "article" || m.kind === "doctorat";
  const r = (m.kind === "doctorat" ? 13 : strong ? 9 : 7) * pop;
  const x = axisX(m.date, geo.width, geo.pad);
  return (
    <g>
      {active && <circle cx={x} cy={geo.axisY} r={r + 9} className="fill-vermilion/25" />}
      <circle
        cx={x}
        cy={geo.axisY}
        r={r}
        className={m.kind === "poster" ? "fill-botanical stroke-paper" : strong ? "fill-vermilion" : "fill-paper"}
        strokeWidth={m.kind === "poster" ? 2.5 : 0}
      />
    </g>
  );
}

function Playhead({ frame, milestones, geo }: { frame: number; milestones: Milestone[]; geo: Geo }) {
  const { index, local, done } = filmCursor(frame, milestones.length);
  const start = geo.pad;
  const from = index <= 0 ? start : axisX(milestones[index - 1].date, geo.width, geo.pad);
  const to = index < 0 ? start : axisX(milestones[index].date, geo.width, geo.pad);
  const x = interpolate(local, [0, MOVE], [from, to], clampOpts);
  const o = interpolate(frame, [INTRO - 12, INTRO], [0, 1], clampOpts) * (done ? interpolate(local - STEP, [0, 18], [1, 0], clampOpts) : 1);
  return <line x1={x} x2={x} y1={geo.axisY - geo.axisY * 0.16} y2={geo.axisY + 14} className="stroke-vermilion" strokeWidth={3} opacity={o} />;
}

const fadeOut = (local: number) => interpolate(local, [0, 7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** The caption holds until the playhead leaves, then hands over to the next one on arrival. */
function Caption({ milestones, variant }: CareerFilmProps) {
  const frame = useCurrentFrame();
  const { index, local, done } = filmCursor(frame, milestones.length);
  if (index < 0) return <Intro opacity={interpolate(frame, [4, 24], [0, 1], clampOpts)} variant={variant} />;
  if (done) {
    const after = local - STEP;
    return after < 8 ? <MilestoneCaption m={milestones[index]} opacity={fadeOut(after)} variant={variant} /> : <Outro milestones={milestones} local={after} variant={variant} />;
  }
  if (local >= MOVE - 2) return <MilestoneCaption m={milestones[index]} opacity={interpolate(local, [MOVE - 2, MOVE + 12], [0, 1], clampOpts)} variant={variant} />;
  if (index === 0) return <Intro opacity={fadeOut(local)} variant={variant} />;
  return <MilestoneCaption m={milestones[index - 1]} opacity={fadeOut(local)} variant={variant} />;
}

function MilestoneCaption({ m, opacity, variant }: { m: Milestone; opacity: number; variant: FilmVariant }) {
  const tag = `${formatDateFr(m.date)} · ${MILESTONE_KIND_LABEL[m.kind]}`;
  const body = m.title.split(" — ").slice(1).join(" — ");
  return <CaptionBlock pad={FILM_TYPE[variant].pad} opacity={opacity} lift={(1 - opacity) * 24} tag={tag} short={m.short} body={body} variant={variant} />;
}

function Intro({ opacity, variant }: { opacity: number; variant: FilmVariant }) {
  return <CaptionBlock pad={FILM_TYPE[variant].pad} opacity={opacity} lift={(1 - opacity) * 20} tag="Jalons vérifiés" short="2022 — 2026" body="Communications, articles et soutenance, d'après HAL, les DOI et theses.fr." variant={variant} />;
}

function Outro({ milestones, local, variant }: { milestones: Milestone[]; local: number; variant: FilmVariant }) {
  const t = interpolate(local, [8, 28], [0, 1], clampOpts);
  const counts = (k: Milestone["kind"][]) => milestones.filter((m) => k.includes(m.kind)).length;
  const body = `${counts(["communication", "poster"])} communications et posters, ${counts(["article"])} articles, ${counts(["doctorat"])} doctorat.`;
  const first = milestones[0].short;
  const short = `${/^[aeiouyéè]/i.test(first) ? "D'" : "De "}${first} à ${milestones[milestones.length - 1].short}`;
  return <CaptionBlock pad={FILM_TYPE[variant].pad} opacity={t} lift={(1 - t) * 20} tag="Parcours" short={short} body={body} variant={variant} />;
}

type CaptionBlockProps = { pad: number; opacity: number; lift: number; tag: string; short: string; body: string; variant: FilmVariant };

function CaptionBlock({ pad, opacity, lift, tag, short, body, variant }: CaptionBlockProps) {
  const type = FILM_TYPE[variant];
  return (
    <div style={{ position: "absolute", left: pad, right: pad, top: pad, opacity, transform: `translateY(${lift}px)` }}>
      <p className="font-sans font-semibold text-vermilion-light tabular-nums" style={{ fontSize: type.meta }}>
        {tag}
      </p>
      <p className="mt-3 font-serif leading-[0.95] tracking-[-0.02em] text-balance" style={{ fontSize: type.short }}>
        {short}
      </p>
      <p className="mt-5 line-clamp-3 max-w-[46ch] font-sans text-paper/80" style={{ fontSize: type.title, lineHeight: 1.35 }}>
        {body}
      </p>
    </div>
  );
}
