"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";

/**
 * Schematic of the idea behind the JFSMA 2024 poster: printed panels with
 * discs that visitors turn. A diagram of the principle, not a replica.
 */
export function RotatingPoster() {
  const [turns, setTurns] = useState(0);
  return (
    <figure>
      <div className="relative mx-auto max-w-sm">
        <svg viewBox="0 0 300 400" className="h-auto w-full" aria-hidden>
          <rect x="6" y="6" width="288" height="388" rx="3" fill="#f5f2eb" stroke="#0b2d4f" strokeWidth="2" />
          <rect x="30" y="30" width="240" height="26" fill="#0b2d4f" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="30" y={72 + i * 16} width={i === 2 ? 150 : 240} height="6" fill="#a8bfd6" />
          ))}
          <Disc cx={100} cy={210} r={58} turns={turns} />
          <Disc cx={210} cy={300} r={48} turns={-turns * 1.4} />
          <rect x="30" y="350" width="120" height="6" fill="#a8bfd6" />
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <figcaption className="text-xs text-mist">Schéma du principe : un support imprimé à disques rotatifs. Photos du poster à venir.</figcaption>
        <button
          type="button"
          onClick={() => setTurns((t) => t + 1)}
          className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-paper/40 px-3 text-sm text-paper hover:bg-paper hover:text-antibes"
        >
          <RotateCw className="size-4" aria-hidden /> Faire tourner
        </button>
      </div>
    </figure>
  );
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (cx: number, cy: number, r: number, deg: number) => `${r2(cx + r * Math.cos((deg * Math.PI) / 180))} ${r2(cy + r * Math.sin((deg * Math.PI) / 180))}`;

function Disc({ cx, cy, r, turns }: { cx: number; cy: number; r: number; turns: number }) {
  return (
    <g style={{ transform: `rotate(${turns * 72}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <circle cx={cx} cy={cy} r={r} fill="#0b2d4f" />
      {[0, 72, 144, 216, 288].map((a, i) => (
        <path
          key={a}
          d={`M${cx} ${cy} L${polar(cx, cy, r, a)} A${r} ${r} 0 0 1 ${polar(cx, cy, r, a + 72)} Z`}
          fill={["#0b2d4f", "#1d4e80", "#2468b3", "#3a6a9b", "#163f6b"][i]}
          stroke="#f5f2eb"
          strokeWidth="1.5"
        />
      ))}
      <circle cx={cx} cy={cy} r={6} fill="#f5f2eb" />
    </g>
  );
}
