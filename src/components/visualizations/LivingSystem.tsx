"use client";

import { H, W, buildSummary } from "./living-system/model";
import { useLivingSystem, type LivingSystemState } from "./living-system/useLivingSystem";
import { Axes, Comparison, ModelCurves, TimeCursor, TrajectoryFan } from "./living-system/ChartLayers";
import { Annotations } from "./living-system/Annotation";
import { Caption, ChartControls, ChartTooltip, Legend } from "./living-system/Panels";

/**
 * THE LIVING SYSTEM — hero visualization.
 * Model, scales and the illustrative-scatter disclaimer: see ./living-system/model.ts.
 */

function LivingSystemChart({ state }: { state: LivingSystemState }) {
  const { model, mode, share, playback, cursorRef, reduce, setTooltip } = state;
  const summary = buildSummary({ share, sigma: model.sigma, main: model.main, withRF: model.withRF, mode });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="group" aria-label={summary}>
      <TrajectoryFan fan={model.fan} onTooltip={setTooltip} />
      <ModelCurves main={model.main} settled={playback.settled} />
      {mode === "comparer" && <Comparison withRF={model.withRF} />}
      <Axes />
      <TimeCursor cursorRef={cursorRef} reduce={reduce} />
      <Annotations main={model.main} onTooltip={setTooltip} />
    </svg>
  );
}

function LivingSystemControls({ state }: { state: LivingSystemState }) {
  const { playback } = state;
  return (
    <ChartControls
      playing={playback.playing}
      onToggle={playback.toggle}
      onReplay={playback.replay}
      share={state.share}
      onShare={state.setShare}
      mode={state.mode}
      onMode={state.setMode}
    />
  );
}

export function LivingSystem() {
  const state = useLivingSystem();
  const { wrapRef, canvasRef, mode, tooltip } = state;
  return (
    <figure ref={wrapRef} className="relative" aria-labelledby="living-system-title">
      <h2 id="living-system-title" className="sr-only">
        Living System — visualisation interactive de deux populations en interaction
      </h2>
      <Legend mode={mode} />
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <LivingSystemChart state={state} />
        {tooltip && <ChartTooltip kind={tooltip} />}
      </div>
      <LivingSystemControls state={state} />
      <Caption />
    </figure>
  );
}
