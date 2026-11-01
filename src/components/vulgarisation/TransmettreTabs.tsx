import Link from "next/link";
import { a11y } from "@/i18n";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/vulgarisation", label: "Vulgarisation" },
  { href: "/enseignement", label: "Enseignement" },
];

/** "Transmettre" groups two pages; this bar switches between them. */
export function TransmettreTabs({ current }: { current: "/vulgarisation" | "/enseignement" }) {
  return (
    <nav aria-label={a11y.sousNavigationTransmettre} className="site-gutter mx-auto max-w-site">
      <ul className="flex gap-8 border-b border-ink/15">
        {TABS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.href === current ? "page" : undefined}
              className={cn("inline-block border-b-2 py-4 font-serif text-xl", t.href === current ? "border-antibes" : "border-transparent text-ink/70 hover:text-ink")}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
