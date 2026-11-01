import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-dark" | "primary-dark";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-paper hover:bg-ink",
  secondary: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
  "ghost-dark": "border border-paper/50 text-paper hover:bg-paper hover:text-antibes",
  "primary-dark": "bg-accent-light text-ink hover:bg-paper",
};

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** Editorial button-link. External links open in a new tab with an explicit arrow. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  icon = true,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
}) {
  const external = isExternal(href) && !href.startsWith("mailto:");
  const cls = cn(
    "group inline-flex min-h-12 items-center justify-center gap-3 rounded-[3px] px-5 py-3 font-serif text-[1.15rem] leading-none transition-[background-color,color,transform] duration-300 active:scale-[0.98]",
    VARIANTS[variant],
    className,
  );
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {children}
      {icon && (
        <Icon
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
      {external && <span className="sr-only">(nouvel onglet)</span>}
    </>
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
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
