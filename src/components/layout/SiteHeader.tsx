"use client";

import Link from "@/i18n/Link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_ITEMS, RESEARCHER } from "@/data/researcher";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils/cn";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useIsActive, type NavItem } from "@/components/layout/nav";
import { useA11y, useLang } from "@/i18n/client";

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

/**
 * The footer's bleu Antibes, carried to the top of the page: inverted
 * monogram, serif links in mist, the current page in italic accent-light
 * marked by the monogram's own full stop.
 */
export function SiteHeader() {
  const { open, setOpen } = useMobileMenu();
  const close = () => setOpen(false);

  return (
    <header className="on-dark bg-antibes text-paper sticky top-0 z-50 [view-transition-name:site-header]">
      <span aria-hidden className="bg-paper/10 pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      <span aria-hidden className="page-progress bg-accent-light pointer-events-none absolute inset-x-0 bottom-0 h-[2px]" />
      <div className="site-gutter max-w-site mx-auto flex h-[4.5rem] items-center gap-6 md:h-20">
        <HomeLink onNavigate={close} />
        <DesktopNav />
        <span className="bg-paper/20 hidden h-7 w-px xl:block" aria-hidden />
        <LangSwitch className="ml-auto xl:ml-0" />
        <ContactLink />
        <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
      </div>
      <MobileMenu open={open} onNavigate={close} />
    </header>
  );
}

function HomeLink({ onNavigate }: { onNavigate: () => void }) {
  const lang = useLang();
  const a11y = useA11y();
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-4"
      aria-label={`${RESEARCHER.displayName} — ${a11y.accueil}`}
      onClick={onNavigate}
    >
      <Monogram inverted className="h-10 w-auto shrink-0 md:h-11" />
      <span className="bg-paper/20 hidden h-9 w-px sm:block" aria-hidden />
      <span className="hidden min-w-0 flex-col whitespace-nowrap sm:flex">
        <span className="font-serif text-2xl leading-none">{RESEARCHER.displayName}</span>
        <span className="label text-mist mt-1.5 truncate xl:hidden">{RESEARCHER.discipline[lang]}</span>
      </span>
    </Link>
  );
}

function DesktopNav() {
  const isActive = useIsActive();
  const a11y = useA11y();
  return (
    <nav aria-label={a11y.navigationPrincipale} className="ml-auto hidden xl:block">
      <ul className="flex items-center gap-5 2xl:gap-7">
        {NAV_ITEMS.map((item) => (
          <DesktopNavItem key={item.href} item={item} active={isActive(item)} />
        ))}
      </ul>
    </nav>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const lang = useLang();
  return (
    <li className="relative">
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "hover:text-paper block py-2 font-serif text-lg transition-colors duration-200",
          active ? "text-accent-light italic" : "text-mist",
        )}
      >
        {item.label[lang]}
      </Link>
      {active && (
        <motion.span
          layoutId="nav-indicator"
          aria-hidden
          className="bg-accent-light absolute -bottom-0.5 left-[calc(50%-2.5px)] size-[5px] rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
      )}
    </li>
  );
}

function ContactLink() {
  return (
    <Link
      href="/contact"
      className="btn btn--paper group hidden items-center gap-2 px-4 py-2.5 font-serif text-body sm:inline-flex"
    >
      Contact
      <ArrowUpRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </Link>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const a11y = useA11y();
  return (
    <button
      type="button"
      className="border-paper/30 hover:bg-antibes-2 inline-flex size-11 items-center justify-center rounded-[3px] border transition-colors duration-200 xl:hidden"
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? a11y.fermerMenu : a11y.ouvrirMenu}
      onClick={onToggle}
    >
      {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
    </button>
  );
}
