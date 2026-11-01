"use client";

import { cn } from "@/lib/utils/cn";
import type { Tone } from "@/components/interactions/email/field";
import { useEmailReveal } from "@/components/interactions/email/useEmailReveal";
import { RevealButton, RevealedEmail } from "@/components/interactions/email/EmailControls";

type Size = "large" | "compact";

/**
 * The address hides in a drifting particle field (dots and the models' Greek
 * letters). On click the real link is laid out invisibly in its final place,
 * the particles fly to its exact glyph pixels from left to right, and the text
 * crystallises underneath them as they dissolve — one continuous motion.
 * Nothing readable exists in the page before the click.
 */
export function ProtectedEmail({ tone = "light", size = "large", className }: { tone?: Tone; size?: Size; className?: string }) {
  const large = size === "large";
  const dark = tone === "dark";
  const { rootRef, canvasRef, linkRef, textRef, copyRef, email, done, copied, reveal, copy } = useEmailReveal({ tone, large });

  return (
    <div ref={rootRef} className={cn("relative", large ? "min-h-24" : "min-h-11", className)}>
      {!done && <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />}
      {!email && <RevealButton large={large} dark={dark} onReveal={reveal} />}
      {email && (
        <RevealedEmail
          email={email}
          done={done}
          copied={copied}
          onCopy={copy}
          linkRef={linkRef}
          textRef={textRef}
          copyRef={copyRef}
          large={large}
          dark={dark}
        />
      )}
    </div>
  );
}
