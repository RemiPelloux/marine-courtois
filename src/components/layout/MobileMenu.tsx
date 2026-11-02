"use client";

import Link from "@/i18n/Link";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, RESEARCHER, SECONDARY_NAV } from "@/data/researcher";
import { cn } from "@/lib/utils/cn";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";
import { SeaRibbon } from "@/components/layout/SeaRibbon";
import { useIsActive } from "@/components/layout/nav";
import { useA11y, useLang } from "@/i18n/client";

const EASE = [0.22, 1, 0.36, 1] as const;
const LIST: Variants = { shown: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } };
const ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

type Close = { onNavigate: () => void };

/** Full-height bleu Antibes panel, laid out like the footer, ending on the same sea. */
export function MobileMenu({ open, onNavigate }: { open: boolean } & Close) {
  const a11y = useA11y();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.25, ease: EASE }}
          className="bg-antibes border-paper/10 fixed inset-x-0 top-[4.5rem] bottom-0 z-40 flex flex-col overflow-y-auto border-t md:top-20 xl:hidden"
        >
          <nav aria-label={a11y.navigationMobile} className="site-gutter flex-1 pt-4 pb-12">
            <PrimaryList onNavigate={onNavigate} />
            <SecondaryLinks onNavigate={onNavigate} />
            <MenuContact onNavigate={onNavigate} />
            <MenuProfiles />
          </nav>
          <SeaRibbon />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PrimaryList({ onNavigate }: Close) {
  const isActive = useIsActive();
  const lang = useLang();
  return (
    <motion.ul variants={LIST} initial="hidden" animate="shown" className="divide-paper/15 border-paper/15 divide-y border-b">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <motion.li key={item.href} variants={ITEM}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-between py-2.5 font-serif text-4xl leading-tight transition-colors",
                active ? "text-accent-light italic" : "text-paper active:text-mist",
              )}
            >
              {item.label[lang]}
              {active && <span aria-hidden className="bg-accent-light size-2 rounded-full" />}
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

function SecondaryLinks({ onNavigate }: Close) {
  const lang = useLang();
  const pages = SECONDARY_NAV.filter((n) => n.href !== "/contact");
  return (
    <ul className="text-mist mt-5 flex flex-wrap gap-x-7 gap-y-1 font-serif text-xl">
      {pages.map((n) => (
        <li key={n.href}>
          <Link href={n.href} onClick={onNavigate} className="link-underline hover:text-paper inline-block py-2">
            {n.label[lang]}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MenuContact({ onNavigate }: Close) {
  return (
    <div className="mt-8">
      <Link
        href="/contact"
        onClick={onNavigate}
        className="bg-paper text-antibes active:bg-accent-light inline-flex items-center gap-2 rounded-[3px] px-5 py-3 font-serif text-xl transition-colors"
      >
        Contact
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
      <ProtectedEmail tone="dark" size="compact" className="mt-4 max-w-sm" />
    </div>
  );
}

function MenuProfiles() {
  return (
    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm">
      {RESEARCHER.profiles.map((p) => (
        <li key={p.label}>
          <a className="link-underline inline-block py-2" href={p.url} target="_blank" rel="noopener noreferrer">
            {p.label} <span className="text-mist text-xs tabular-nums">{p.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
