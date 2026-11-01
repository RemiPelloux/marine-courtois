"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Copy, MousePointerClick } from "lucide-react";
import { RESEARCHER } from "@/data/researcher";
import { a11y } from "@/i18n";
import { decodeEmail } from "@/lib/utils/email";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { mulberry32 } from "@/lib/utils/random";
import { cn } from "@/lib/utils/cn";

type Tone = "light" | "dark";
type Size = "large" | "compact";
type Phase = "drift" | "assemble" | "done";

const GLYPHS = ["σ", "δ", "ε", "μ", "η", "ρ", "λ", "@"];
const PALETTE: Record<Tone, string[]> = {
  light: ["#0f1d2e", "#2468b3", "#2468b3", "#55626f"],
  dark: ["#f5f2eb", "#6fb3f2", "#6fb3f2", "#a8bfd6"],
};
/** flight of one particle; arrivals spread left → right over SPREAD, the text sweep trails them */
const FLIGHT = 820;
const SPREAD = 420;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  r: number;
  delay: number;
  bend: number;
  color: string;
  glyph?: string;
  born: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Pixels of `text` drawn exactly where the real link sits (same font, same baseline). */
function sampleAt(text: string, font: string, left: number, baseline: number, w: number, h: number, step: number) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.font = font;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, left, baseline);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < c.height; y += step) for (let x = 0; x < c.width; x += step) if (data[(y * c.width + x) * 4 + 3] > 120) pts.push([x, y]);
  return pts;
}

/**
 * The address hides in a drifting particle field (dots and the models' Greek
 * letters). On click the real link is laid out invisibly in its final place,
 * the particles fly to its exact glyph pixels from left to right, and the text
 * crystallises underneath them as they dissolve — one continuous motion.
 * Nothing readable exists in the page before the click.
 */
export function ProtectedEmail({ tone = "light", size = "large", className }: { tone?: Tone; size?: Size; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const particles = useRef<Particle[]>([]);
  const phase = useRef<Phase>("drift");
  const t0 = useRef(0);
  const reduce = usePrefersReducedMotion();
  const [email, setEmail] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const large = size === "large";
  const dark = tone === "dark";

  const seedField = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const { width: w, height: h } = root.getBoundingClientRect();
    const rand = mulberry32(large ? 4 : 9);
    const colors = PALETTE[tone];
    particles.current = Array.from({ length: large ? 90 : 34 }, (_, i) => {
      const x = rand() * w;
      const y = rand() * h;
      return {
        x,
        y,
        sx: x,
        sy: y,
        tx: x,
        ty: y,
        vx: (rand() - 0.5) * 0.25,
        vy: (rand() - 0.5) * 0.25,
        r: 0.9 + rand() * 1.5,
        delay: 0,
        bend: 0,
        color: colors[i % colors.length],
        glyph: i % 7 === 0 ? GLYPHS[i % GLYPHS.length] : undefined,
        born: 0,
      };
    });
  }, [large, tone]);

  // render loop: drift, then assemble + crystallise
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || done) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (phase.current === "drift") seedField();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible && phase.current === "drift") return;
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const elapsed = now - t0.current;
      const assembling = phase.current === "assemble";

      for (const q of particles.current) {
        let alpha = 0.75;
        let radius = q.r;
        if (!assembling) {
          if (!reduce) {
            q.x += q.vx;
            q.y += q.vy;
            if (q.x < 0 || q.x > rect.width) q.vx *= -1;
            if (q.y < 0 || q.y > rect.height) q.vy *= -1;
          }
        } else {
          const p = clamp01((elapsed - q.delay) / FLIGHT);
          const e = easeOutCubic(p);
          // curved flight: a perpendicular arc that vanishes on arrival
          const arc = Math.sin(p * Math.PI) * q.bend;
          const dx = q.tx - q.sx;
          const dy = q.ty - q.sy;
          const len = Math.hypot(dx, dy) || 1;
          q.x = q.sx + dx * e + (-dy / len) * arc;
          q.y = q.sy + dy * e + (dx / len) * arc;
          radius = q.r + (0.85 - q.r) * e;
          const born = clamp01((elapsed - q.born) / 180);
          // dissolve once landed, as the text crystallises under it
          const land = clamp01((elapsed - q.delay - FLIGHT) / 260);
          alpha = (0.55 + 0.45 * e) * born * (1 - land);
        }
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = q.color;
        if (q.glyph && !assembling) {
          ctx.font = `italic ${large ? 15 : 11}px "Instrument Serif", Georgia, serif`;
          ctx.fillText(q.glyph, q.x, q.y);
        } else {
          ctx.beginPath();
          ctx.arc(q.x, q.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (assembling) {
        // write-on sweep of the real text, trailing the particles' arrival
        const text = textRef.current;
        if (text) {
          const s = clamp01((elapsed - FLIGHT - 40) / (SPREAD + 140));
          text.style.clipPath = `inset(-20% ${(100 - s * 100).toFixed(2)}% -20% 0)`;
          text.style.opacity = "1";
        }
        const total = FLIGHT + SPREAD + 400;
        if (copyRef.current) copyRef.current.style.opacity = String(clamp01((elapsed - total + 200) / 300));
        if (elapsed > total + 320) {
          cancelAnimationFrame(raf);
          ctx.clearRect(0, 0, rect.width, rect.height);
          phase.current = "done";
          setDone(true);
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [done, seedField, reduce, large]);

  // once the real link is laid out (invisible), aim the particles at its glyphs
  useLayoutEffect(() => {
    if (!email || phase.current !== "drift" || reduce) return;
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return;
    const rr = root.getBoundingClientRect();
    const tr = text.getBoundingClientRect();
    const cs = getComputedStyle(text);
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = font;
    const ascent = probe.measureText(email).fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
    const targets = sampleAt(email, font, tr.left - rr.left, tr.top - rr.top + ascent, rr.width, rr.height, large ? 2 : 1);
    const rand = mulberry32(11);
    const colors = PALETTE[tone];
    const field = particles.current;
    const span = Math.max(1, tr.width);
    particles.current = targets.map(([tx, ty], i) => {
      const src = field[i % field.length];
      const fresh = i >= field.length;
      // extra particles gather from the edges of the field, fading in
      const sx = fresh ? (rand() < 0.5 ? -10 : rr.width + 10) * rand() + rand() * rr.width * 0.3 : src.x;
      const sy = fresh ? rand() * rr.height : src.y;
      return {
        ...src,
        x: sx,
        y: sy,
        sx,
        sy,
        tx,
        ty,
        glyph: undefined,
        color: colors[i % colors.length],
        delay: ((tx - (tr.left - rr.left)) / span) * SPREAD + rand() * 90,
        bend: (rand() - 0.5) * (large ? 46 : 18),
        born: fresh ? rand() * 160 : -999,
      };
    });
    text.style.opacity = "1";
    text.style.clipPath = "inset(-20% 100% -20% 0)";
    t0.current = performance.now();
    phase.current = "assemble";
  }, [email, reduce, large, tone]);

  useEffect(() => {
    if (!done) return;
    if (textRef.current) {
      textRef.current.style.clipPath = "";
      textRef.current.style.opacity = "";
    }
    if (copyRef.current) copyRef.current.style.opacity = "";
    linkRef.current?.focus({ preventScroll: true });
  }, [done]);

  const reveal = () => {
    setEmail(decodeEmail(RESEARCHER.emailCodes));
    // reduced motion: the address appears at once, without the particle flight
    if (reduce) {
      phase.current = "done";
      setDone(true);
    }
  };

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the address stays selectable */
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", large ? "min-h-24" : "min-h-11", className)}>
      {!done && <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />}

      {!email && (
        <button
          type="button"
          onClick={reveal}
          aria-label={a11y.revealEmail}
          className={cn("group absolute inset-0 block w-full text-left transition-colors", dark ? "hover:bg-paper/[0.04]" : "hover:bg-ink/[0.03]")}
        >
          <span
            className={cn(
              "absolute inline-flex items-center gap-2 px-2.5 py-1 transition-colors duration-300",
              large ? "right-2 bottom-2 text-sm" : "right-0 bottom-1.5 text-xs",
              dark ? "bg-antibes text-paper group-hover:bg-antibes-2" : "bg-paper text-ink ring-1 ring-ink/15 group-hover:bg-ink group-hover:text-paper",
            )}
          >
            <MousePointerClick className={large ? "size-4" : "size-3.5"} aria-hidden />
            Cliquer pour afficher
          </span>
        </button>
      )}

      {email && (
        <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", large ? "min-h-24" : "min-h-11")} aria-live="polite">
          <a ref={linkRef} href={`mailto:${email}`} className={cn("font-serif", large ? "text-[1.6rem] sm:text-3xl" : "text-base", dark ? "text-paper" : "text-ink")}>
            <span ref={textRef} className="link-underline break-all" style={done ? undefined : { opacity: 0 }}>
              {email}
            </span>
          </a>
          <button
            ref={copyRef}
            type="button"
            onClick={copy}
            aria-label={a11y.copyEmail}
            style={done ? undefined : { opacity: 0 }}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-xs transition-colors",
              dark ? "border-paper/40 text-paper hover:bg-paper hover:text-antibes" : "border-ink/40 text-ink hover:bg-ink hover:text-paper",
            )}
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copiée" : "Copier"}
          </button>
        </div>
      )}
    </div>
  );
}
