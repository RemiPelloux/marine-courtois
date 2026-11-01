"use client";

import { a11y } from "@/i18n";
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
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

/** Deep link: /laboratoire#modele-fertilite | #modele-accouplements | #modele-dynamique */
function useHashTab({ setTab, rootRef }: { setTab: (t: ExplorerTab) => void; rootRef: RefObject<HTMLDivElement | null> }) {
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
  }, [setTab, rootRef]);
}

function nextTabIndex(key: string, i: number): number | null {
  if (key === "ArrowRight") return (i + 1) % TABS.length;
  if (key === "ArrowLeft") return (i - 1 + TABS.length) % TABS.length;
  if (key === "Home") return 0;
  if (key === "End") return TABS.length - 1;
  return null;
}

interface TabButtonProps {
  t: (typeof TABS)[number];
  i: number;
  active: boolean;
  reduce: boolean | null;
  onSelect: () => void;
  onKey: (e: KeyboardEvent) => void;
  setRef: (el: HTMLButtonElement | null) => void;
}

function TabUnderline({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.span
      layoutId="explorer-tab"
      className="absolute inset-x-0 -bottom-px h-[2px] bg-azur"
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 36 }}
    />
  );
}

function TabButton({ t, i, active, reduce, onSelect, onKey, setRef }: TabButtonProps) {
  return (
    <button
      ref={setRef}
      role="tab"
      id={`tab-${t.id}`}
      aria-selected={active}
      aria-controls={`panel-${t.id}`}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKey}
      className={cn(
        "group relative flex items-baseline gap-4 px-1 py-5 text-left transition-colors sm:px-5",
        i > 0 && "border-t border-paper/25 sm:border-t-0 sm:border-l",
        active ? "text-paper" : "text-paper/60 hover:text-paper",
      )}
    >
      <span className="font-serif text-2xl md:text-[1.7rem]">{t.label}</span>
      {active && <TabUnderline reduce={reduce} />}
    </button>
  );
}

/** Roving focus across the tabs with arrow / Home / End keys. */
function useTabKeyboard(setTab: (t: ExplorerTab) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const next = nextTabIndex(e.key, i);
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next].id);
    refs.current[next]?.focus();
  };
  return { refs, onKey };
}

function ExplorerTabList({ tab, setTab, reduce }: { tab: ExplorerTab; setTab: (t: ExplorerTab) => void; reduce: boolean | null }) {
  const { refs, onKey } = useTabKeyboard(setTab);
  return (
    <div role="tablist" aria-label={a11y.modeles} className="grid border-y border-paper/25 sm:grid-cols-3">
      {TABS.map((t, i) => (
        <TabButton
          key={t.id}
          t={t}
          i={i}
          active={t.id === tab}
          reduce={reduce}
          onSelect={() => setTab(t.id)}
          onKey={(e) => onKey(e, i)}
          setRef={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

function ExplorerTabPanel({ tab, content, reduce }: { tab: ExplorerTab; content: Record<ExplorerTab, ExplorerContent>; reduce: boolean | null }) {
  return (
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
  );
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  useHashTab({ setTab, rootRef });

  return (
    <div ref={rootRef} className={cn("scroll-mt-28", dark && "on-dark text-paper")}>
      <ExplorerTabList tab={tab} setTab={setTab} reduce={reduce} />
      <ExplorerTabPanel tab={tab} content={content} reduce={reduce} />
    </div>
  );
}
