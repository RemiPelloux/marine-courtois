import Link from "@/i18n/Link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NewTabHint } from "@/components/ui/NewTab";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-dark" | "primary-dark";

/** Minimal buttons: face, hairline and hover lift per variant live in globals.css (.btn). */
const VARIANTS: Record<Variant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  "ghost-dark": "btn--ghost-dark",
  "primary-dark": "btn--primary-dark",
};

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
}

/** Editorial button-link. External links open in a new tab with an explicit arrow. */
export function ButtonLink({ href, children, variant = "primary", className, icon = true }: ButtonLinkProps) {
  const external = isExternal(href) && !href.startsWith("mailto:");
  const cls = cn(
    "btn group inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 font-serif text-[1.15rem] leading-none",
    VARIANTS[variant],
    className,
  );
  const content = (
    <ButtonLinkContent external={external} icon={icon}>
      {children}
    </ButtonLinkContent>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Label, trailing arrow (↗ when it opens a new tab) and the screen-reader new-tab hint. */
function ButtonLinkContent({ external, icon, children }: { external: boolean; icon: boolean; children: ReactNode }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <>
      {children}
      {icon && (
        <Icon
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
      {external && <NewTabHint />}
    </>
  );
}

/** Small underlined text link with optional external arrow. */
export function TextLink({
  href,
  children,
  className,
  ...rest
}: { href: string; children: ReactNode; className?: string } & Omit<ComponentProps<"a">, "href">) {
  const external = /^https?:/.test(href);
  const cls = cn("link-underline inline-flex items-baseline gap-1 py-1", className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
        <ArrowUpRight className="size-[0.85em] shrink-0 translate-y-[0.1em]" aria-hidden />
        <NewTabHint />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
