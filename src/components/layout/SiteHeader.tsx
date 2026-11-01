"use client";

import { a11y } from "@/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_ITEMS, RESEARCHER } from "@/data/researcher";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils/cn";
import { ProtectedEmail } from "@/components/interactions/ProtectedEmail";

type NavItem = (typeof NAV_ITEMS)[number];

/** Open state of the mobile menu; while open, Escape closes it and the page behind stops scrolling. */
function useMobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  return { open, setOpen };
}

function useIsActive() {
  const pathname = usePathname();
  return (item: NavItem) => item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

export function SiteHeader() {
  const { open, setOpen } = useMobileMenu();
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/80 bg-paper [view-transition-name:site-header]">
      <span aria-hidden className="page-progress pointer-events-none absolute inset-x-0 -bottom-px h-[2px] bg-antibes" />
      <div className="site-gutter mx-auto flex h-[4.5rem] max-w-site items-center gap-6 md:h-20">
        <HomeLink onNavigate={close} />
        <DesktopNav />
        <span className="hidden h-7 w-px bg-rule xl:block" aria-hidden />
        <ContactLink />
        <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
      <MobileMenu open={open} onNavigate={close} />
    </header>
  );
}

function HomeLink({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-4"
      aria-label={`${RESEARCHER.displayName} — accueil`}
      onClick={onNavigate}
    >
      <Monogram className="h-10 w-auto md:h-11" />
      <span className="hidden h-9 w-px bg-rule sm:block" aria-hidden />
      <span className="hidden flex-col sm:flex">
        <span className="font-serif text-[1.45rem] leading-none">{RESEARCHER.displayName}</span>
        <span className="label mt-1.5 text-xs text-ink/80">{RESEARCHER.discipline}</span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label={a11y.navigationPrincipale} className="ml-auto hidden xl:block">
      <ul className="flex items-center gap-6 2xl:gap-8">
        {NAV_ITEMS.map((item) => (
          <DesktopNavItem key={item.href} item={item} active={isActive(item)} />
        ))}
      </ul>
    </nav>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <li className="relative">
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "font-serif text-[1.12rem] transition-colors hover:text-accent-deep",
          active ? "text-ink" : "text-ink/85",
        )}
      >
        {item.label}
      </Link>
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-2 left-0 h-[2px] w-full bg-antibes"
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
        />
      )}
    </li>
  );
}

function ContactLink() {
  return (
    <Link
      href="/contact"
      className="group ml-auto hidden items-center gap-2 rounded-[3px] bg-ink px-4 py-2.5 font-serif text-[1.05rem] text-paper transition-colors hover:bg-accent-deep active:scale-[0.98] sm:inline-flex xl:ml-0"
    >
      Contact
      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
    </Link>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="ml-auto inline-flex size-11 items-center justify-center rounded-[3px] border border-ink/70 sm:ml-0 xl:hidden"
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      onClick={onToggle}
    >
      {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
    </button>
  );
}

function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-ink/80 bg-paper md:top-20 xl:hidden"
        >
          <nav aria-label={a11y.navigationMobile} className="site-gutter py-8">
            <MobileNavList onNavigate={onNavigate} />
            <ProtectedEmail size="compact" className="mt-8" />
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavList({ onNavigate }: { onNavigate: () => void }) {
  const isActive = useIsActive();
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {NAV_ITEMS.map((item, i) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(item) ? "page" : undefined}
            className="flex items-baseline gap-5 py-4"
          >
            <span className="tabular-nums text-xs text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
            <span className={cn("font-serif text-4xl", isActive(item) && "italic text-accent-deep")}>{item.label}</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/contact" onClick={onNavigate} className="flex items-baseline gap-5 py-4">
          <span className="tabular-nums text-xs text-accent-deep">{String(NAV_ITEMS.length + 1).padStart(2, "0")}</span>
          <span className="font-serif text-4xl">Contact</span>
        </Link>
      </li>
    </ul>
  );
}
