"use client";

import { useId, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { copy } from "@/i18n/config";
import { useLang } from "@/i18n/client";

const COPY = copy({
  fr: { pause: "Pause", play: "Lecture", reset: "Relancer" },
  en: { pause: "Pause", play: "Play", reset: "Restart" },
});

interface SliderProps {
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
}

/** Labelled range input with a live, formatted output. Keyboard and touch friendly. */
export function Slider({ label, symbol, value, min, max, step, onChange, format = (v) => String(v), hint, className, dark = false }: SliderProps) {
  const id = useId();
  const pctValue = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("grid gap-1", className)}>
      <SliderReadout id={id} label={label} symbol={symbol} output={format(value)} dark={dark} />
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

/** Label (with optional symbol) on the left, the formatted value on the right. */
function SliderReadout({ id, label, symbol, output, dark }: { id: string; label: string; symbol?: ReactNode; output: string; dark: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={id} className={cn("text-sm", dark ? "text-paper" : "text-ink")}>
        {label}
        {symbol && <span className="ml-2 tabular-nums text-xs text-accent-deep on-dark:text-accent-light">{symbol}</span>}
      </label>
      <output
        htmlFor={id}
        className={cn(
          "min-w-16 rounded-[3px] border px-2 py-0.5 text-right tabular-nums text-sm tabular-nums",
          dark ? "border-paper/25 text-paper" : "border-rule bg-paper text-ink",
        )}
      >
        {output}
      </output>
    </div>
  );
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  dark?: boolean;
}

export function SegmentedControl<T extends string>({ label, options, value, onChange, className, dark = false }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-[3px] border p-0.5", dark ? "border-paper/30" : "border-ink/70", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn("min-h-9 rounded-[2px] px-3 text-[0.8rem] transition-colors", segmentTone(o.value === value, dark))}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function segmentTone(active: boolean, dark: boolean) {
  if (active) return dark ? "bg-paper text-antibes" : "bg-ink text-paper";
  return dark ? "text-paper/80 hover:text-paper" : "text-ink/75 hover:text-ink";
}

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
  className?: string;
  label?: string;
  pressed?: boolean;
}

export function IconButton({ onClick, children, variant = "outline", className, label, pressed }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[3px] px-3.5 text-[0.82rem] transition-[background-color,color,transform] active:scale-[0.97]",
        variant === "solid" && "bg-ink text-paper hover:bg-accent-deep",
        variant === "outline" && "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
        variant === "outline-dark" && "border border-paper/40 text-paper hover:bg-paper hover:text-antibes",
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
  resetLabel,
  dark = false,
}: {
  playing: boolean;
  onToggle: () => void;
  onReset: () => void;
  resetLabel?: string;
  dark?: boolean;
}) {
  const t = COPY[useLang()];
  return (
    <div className="flex items-center gap-2">
      <IconButton onClick={onToggle} variant={dark ? "outline-dark" : "solid"}>
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        {playing ? t.pause : t.play}
      </IconButton>
      <IconButton onClick={onReset} variant={dark ? "outline-dark" : "outline"}>
        <RotateCcw className="size-4" aria-hidden />
        {resetLabel ?? t.reset}
      </IconButton>
    </div>
  );
}
