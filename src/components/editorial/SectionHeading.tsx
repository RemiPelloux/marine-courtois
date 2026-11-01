import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export function SectionHeading({
  chapter,
  kicker,
  title,
  intro,
  className,
  as: H = "h2",
  size = "headline",
}: {
  chapter?: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  size?: "display" | "headline" | "title";
}) {
  return (
    <header className={cn("grid gap-6 md:grid-cols-12", className)}>
      <Kicker accent={chapter} className="md:col-span-12">
        {kicker}
      </Kicker>
      <H
        className={cn(
          "font-serif md:col-span-9",
          size === "display" && "text-display",
          size === "headline" && "text-headline",
          size === "title" && "text-title",
        )}
      >
        {title}
      </H>
      {intro && <div className="max-w-2xl text-[1.05rem] leading-relaxed text-ink/85 on-dark:text-paper/80 md:col-span-7">{intro}</div>}
    </header>
  );
}
