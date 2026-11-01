"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { a11y } from "@/i18n";
import { MILESTONES } from "@/data/milestones";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CareerFilm, type CareerFilmProps } from "./film/CareerFilm";
import { FILM_FPS, FILM_SIZE, filmDuration, type FilmVariant } from "./film/layout";

const WIDE_QUERY = "(min-width: 768px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useFilmVariant(): FilmVariant {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(WIDE_QUERY).matches ? "wide" : "narrow"),
    () => "wide",
  );
}

/** Plays once per layout when it first scrolls into view; pauses offscreen. Reduced motion opens on the final frame. */
function usePlayInView(player: React.RefObject<PlayerRef | null>, inView: boolean, reduce: boolean, variant: FilmVariant) {
  const started = useRef<FilmVariant | null>(null);
  useEffect(() => {
    const p = player.current;
    if (!p || reduce) return;
    if (inView && started.current !== variant) {
      started.current = variant;
      p.play();
    } else if (!inView && p.isPlaying()) {
      p.pause();
    }
  }, [player, inView, reduce, variant]);
}

/** Fixed player behaviour: own controls, no audio, stays on the last frame when the film ends. */
const PLAYER_OPTIONS = {
  controls: true,
  clickToPlay: true,
  spaceKeyToPlayOrPause: true,
  showVolumeControls: false,
  moveToBeginningWhenEnded: false,
  acknowledgeRemotionLicense: true,
  fps: FILM_FPS,
  durationInFrames: filmDuration(MILESTONES.length),
} as const;

export function CareerFilmPlayer() {
  const variant = useFilmVariant();
  const reduce = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const inView = useInView(box, "0px 0px -25% 0px");
  usePlayInView(player, inView, reduce, variant);
  const { width, height } = FILM_SIZE[variant];
  return (
    <div ref={box} role="region" aria-label={a11y.filmDuParcours}>
      <Player
        key={variant}
        ref={player}
        component={CareerFilm}
        inputProps={{ milestones: MILESTONES, variant } satisfies CareerFilmProps}
        compositionWidth={width}
        compositionHeight={height}
        initialFrame={reduce ? PLAYER_OPTIONS.durationInFrames - 1 : 0}
        {...PLAYER_OPTIONS}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
      />
    </div>
  );
}
