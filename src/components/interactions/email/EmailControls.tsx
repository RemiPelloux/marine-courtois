"use client";

import type { RefObject } from "react";
import { Check, Copy, MousePointerClick } from "lucide-react";
import { copy } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { cn } from "@/lib/utils/cn";

const COPY = copy({
  fr: { show: "Cliquer pour afficher", copy: "Copier", copied: "Copiée" },
  en: { show: "Click to show", copy: "Copy", copied: "Copied" },
});

interface Look {
  large: boolean;
  dark: boolean;
}

/** Full-surface trigger over the particle field, with its "click to show" tag in the corner. */
export function RevealButton({ large, dark, onReveal }: Look & { onReveal: () => void }) {
  const a11y = useA11y();
  const t = COPY[useLang()];
  return (
    <button
      type="button"
      onClick={onReveal}
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
        {t.show}
      </span>
    </button>
  );
}

interface RevealedEmailProps extends Look {
  email: string;
  /** false while the particles are still assembling: link text and copy button start hidden */
  done: boolean;
  copied: boolean;
  onCopy: () => void;
  linkRef: RefObject<HTMLAnchorElement | null>;
  textRef: RefObject<HTMLSpanElement | null>;
  copyRef: RefObject<HTMLButtonElement | null>;
}

/** The decoded mailto link and its copy button. */
export function RevealedEmail({ email, done, copied, onCopy, linkRef, textRef, copyRef, large, dark }: RevealedEmailProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", large ? "min-h-24" : "min-h-11")} aria-live="polite">
      <a ref={linkRef} href={`mailto:${email}`} className={cn("font-serif", large ? "text-card sm:text-3xl" : "text-base", dark ? "text-paper" : "text-ink")}>
        <span ref={textRef} className="link-underline break-all" style={done ? undefined : { opacity: 0 }}>
          {email}
        </span>
      </a>
      <CopyButton buttonRef={copyRef} done={done} copied={copied} onCopy={onCopy} dark={dark} />
    </div>
  );
}

interface CopyButtonProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  done: boolean;
  copied: boolean;
  onCopy: () => void;
  dark: boolean;
}

function CopyButton({ buttonRef, done, copied, onCopy, dark }: CopyButtonProps) {
  const a11y = useA11y();
  const t = COPY[useLang()];
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onCopy}
      aria-label={a11y.copyEmail}
      style={done ? undefined : { opacity: 0 }}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-xs transition-colors",
        dark ? "border-paper/40 text-paper hover:bg-paper hover:text-antibes" : "border-ink/40 text-ink hover:bg-ink hover:text-paper",
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? t.copied : t.copy}
    </button>
  );
}
