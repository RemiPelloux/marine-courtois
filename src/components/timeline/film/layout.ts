import { dateToYear } from "@/data/milestones";

/** Film timing, in frames at FILM_FPS. */
export const FILM_FPS = 30;
export const INTRO = 36;
export const MOVE = 16;
export const HOLD = 32;
export const STEP = MOVE + HOLD;
export const OUTRO = 72;

export const filmDuration = (count: number) => INTRO + count * STEP + OUTRO;

export type FilmVariant = "wide" | "narrow";

export const FILM_SIZE: Record<FilmVariant, { width: number; height: number }> = {
  wide: { width: 1280, height: 600 },
  narrow: { width: 720, height: 900 },
};

/** Type and spacing per variant, in composition pixels. */
export const FILM_TYPE: Record<FilmVariant, { pad: number; short: number; title: number; meta: number; axisY: number }> = {
  wide: { pad: 72, short: 76, title: 24, meta: 20, axisY: 0.74 },
  narrow: { pad: 48, short: 64, title: 28, meta: 24, axisY: 0.8 },
};

const AXIS_FROM = 2022.5;
const AXIS_TO = 2026.5;
export const AXIS_YEARS = [2023, 2024, 2025, 2026];

/** Horizontal position of an ISO date on the film's axis. */
export function axisX(iso: string | number, width: number, pad: number): number {
  const year = typeof iso === "number" ? iso : dateToYear(iso);
  return pad + ((year - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * (width - pad * 2);
}

/** Which milestone the playhead is on at `frame`, and how far into its step it is. */
export function filmCursor(frame: number, count: number): { index: number; local: number; done: boolean } {
  const t = frame - INTRO;
  if (t < 0) return { index: -1, local: t, done: false };
  const index = Math.min(Math.floor(t / STEP), count - 1);
  return { index, local: t - index * STEP, done: t >= count * STEP };
}

/** Milestones the playhead has reached at `frame` (a milestone counts once the playhead arrives). */
export function reachedCount(frame: number, count: number): number {
  const { index, local } = filmCursor(frame, count);
  if (index < 0) return 0;
  return index + (local >= MOVE ? 1 : 0);
}
