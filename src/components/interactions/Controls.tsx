"use client";

import { useId, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Labelled range input with a live, formatted output. Keyboard and touch friendly. */
export function Slider({
  label,
  symbol,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => String(v),
  hint,
  className,
  dark = false,
}: {
  label: string;
  symbol?: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  className?: string;
  dark?: boolean;
}) {
  const id = useId();
  const pctValue = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("grid gap-1", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={cn("text-sm", dark ? "text-paper" : "text-ink")}>
          {label}
          {symbol && <span className="ml-2 tabular-nums text-xs text-vermilion-deep on-dark:text-vermilion-light">{symbol}</span>}
        </label>
        <output
          htmlFor={id}
          className={cn(
            "min-w-16 rounded-[3px] border px-2 py-0.5 text-right tabular-nums text-sm tabular-nums",
            dark ? "border-paper/25 text-paper" : "border-rule bg-paper text-ink",
          )}
        >
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        style={{ ["--pct" as string]: `${pctValue}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className={cn("text-xs leading-snug", dark ? "text-mist" : "text-muted")}>{hint}</p>}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  dark = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-[3px] border p-0.5", dark ? "border-paper/30" : "border-ink/70", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-9 rounded-[2px] px-3 text-[0.8rem] transition-colors",
              active
                ? dark
                  ? "bg-paper text-botanical"
                  : "bg-ink text-paper"
                : dark
                  ? "text-paper/80 hover:text-paper"
                  : "text-ink/75 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function IconButton({
  onClick,
  children,
  variant = "outline",
  className,
  label,
  pressed,
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
  className?: string;
  label?: string;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[3px] px-3.5 text-[0.82rem] transition-[background-color,color,transform] active:scale-[0.97]",
        variant === "solid" && "bg-ink text-paper hover:bg-vermilion-deep",
        variant === "outline" && "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
        variant === "outline-dark" && "border border-paper/40 text-paper hover:bg-paper hover:text-botanical",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PlayPauseReset({
  playing,
  onToggle,
  onReset,
  resetLabel = "Relancer",
  dark = false,
}: {
  playing: boolean;
  onToggle: () => void;
  onReset: () => void;
  resetLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <IconButton onClick={onToggle} variant={dark ? "outline-dark" : "solid"}>
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        {playing ? "Pause" : "Lecture"}
      </IconButton>
      <IconButton onClick={onReset} variant={dark ? "outline-dark" : "outline"}>
        <RotateCcw className="size-4" aria-hidden />
        {resetLabel}
      </IconButton>
    </div>
  );
}
