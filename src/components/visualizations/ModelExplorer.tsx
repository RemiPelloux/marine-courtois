"use client";

import { a11y } from "@/i18n";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import type { ExplorerContent } from "./explorer/PanelLayout";
import { ResidualFertilityPanel } from "./explorer/ResidualFertilityPanel";
import { RematingPanel } from "./explorer/RematingPanel";
import { CobwebPanel } from "./explorer/CobwebPanel";

export type { ExplorerContent } from "./explorer/PanelLayout";

export type ExplorerTab = "fertilite" | "accouplements" | "dynamique";

const TABS: { id: ExplorerTab; label: string; n: string }[] = [
  { id: "fertilite", label: "Fertilité résiduelle", n: "01" },
  { id: "accouplements", label: "Accouplements multiples", n: "02" },
  { id: "dynamique", label: "Dynamique des populations", n: "03" },
];



export function ModelExplorer({
  content,
  initialTab = "fertilite",
  dark = true,
}: {
  content: Record<ExplorerTab, ExplorerContent>;
  initialTab?: ExplorerTab;
  dark?: boolean;
}) {
  const [tab, setTab] = useState<ExplorerTab>(initialTab);
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // deep link: /laboratoire#modele-fertilite | #modele-accouplements | #modele-dynamique
  useEffect(() => {
    const apply = () => {
      const m = window.location.hash.match(/^#modele-(fertilite|accouplements|dynamique)$/);
      if (m) {
        setTab(m[1] as ExplorerTab);
        rootRef.current?.scrollIntoView({ block: "start" });
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("scroll-mt-28", dark && "on-dark text-paper")}>
      <div role="tablist" aria-label={a11y.modeles} className="grid border-y border-paper/25 sm:grid-cols-3">
        {TABS.map((t, i) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "group relative flex items-baseline gap-4 px-1 py-5 text-left transition-colors sm:px-5",
                i > 0 && "border-t border-paper/25 sm:border-t-0 sm:border-l",
                active ? "text-paper" : "text-paper/60 hover:text-paper",
              )}
            >
              <span className="font-serif text-2xl md:text-[1.7rem]">{t.label}</span>
              {active && (
                <motion.span
                  layoutId="explorer-tab"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-vermilion"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 outline-none"
        >
          {tab === "fertilite" && <ResidualFertilityPanel content={content.fertilite} />}
          {tab === "accouplements" && <RematingPanel content={content.accouplements} />}
          {tab === "dynamique" && <CobwebPanel content={content.dynamique} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

