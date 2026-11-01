import Link from "@/i18n/Link";
import { copy } from "@/i18n/config";
import { getA11y, getLang } from "@/i18n/server";
import { cn } from "@/lib/utils/cn";

const TABS = copy({
  fr: [
    { href: "/vulgarisation", label: "Vulgarisation" },
    { href: "/enseignement", label: "Enseignement" },
  ],
  en: [
    { href: "/vulgarisation", label: "Outreach" },
    { href: "/enseignement", label: "Teaching" },
  ],
});

/** "Transmettre" groups two pages; this bar switches between them. */
export async function TransmettreTabs({ current }: { current: "/vulgarisation" | "/enseignement" }) {
  const lang = await getLang();
  const a11y = await getA11y();
  return (
    <nav aria-label={a11y.sousNavigationTransmettre} className="site-gutter mx-auto max-w-site">
      <ul className="flex gap-8 border-b border-ink/15">
        {TABS[lang].map((t) => (
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
