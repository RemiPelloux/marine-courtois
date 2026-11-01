"use client";

import { usePathname } from "next/navigation";
import { LANGS, type Lang } from "@/i18n/config";
import { useA11y, useLang } from "@/i18n/client";
import { switchPath } from "@/i18n/paths";
import { cn } from "@/lib/utils/cn";

/** Each language names itself, in its own language. */
const NAME: Record<Lang, string> = { fr: "Français", en: "English" };

/**
 * FR | EN, drawn like the Contact button: one ink-ruled block, the current
 * language filled. Each half links to the same page in its language.
 * Plain <a>: the two languages have different root layouts, so the switch is a
 * full page load; a next/link here would prefetch the other root in a loop.
 */
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const pathname = usePathname();
  const a11y = useA11y();
  return (
    <nav aria-label={a11y.langue} className={cn("shrink-0", className)}>
      <ul className="flex h-11 items-stretch overflow-hidden rounded-[3px] border border-ink/70">
        {LANGS.map((l, i) => {
          const current = l === lang;
          return (
            <li key={l} className={cn("flex", i > 0 && "border-l border-ink/70")}>
              <a
                href={switchPath(pathname, l)}
                hrefLang={l}
                lang={l}
                aria-label={NAME[l]}
                aria-current={current ? "true" : undefined}
                title={NAME[l]}
                className={cn(
                  "inline-flex min-w-11 items-center justify-center px-2.5 font-serif text-[1.05rem] leading-none tracking-[0.04em] transition-colors duration-200",
                  current ? "bg-ink text-paper" : "text-ink/75 hover:bg-stone hover:text-accent-deep",
                )}
              >
                {l.toUpperCase()}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
