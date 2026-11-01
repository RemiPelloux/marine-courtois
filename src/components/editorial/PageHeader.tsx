import { Kicker } from "@/components/ui/Kicker";
import { HeroTitleStatic } from "@/components/editorial/HeroTitleStatic";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Interior page header: chapter label, large serif title, intro, optional aside. */
export function PageHeader({
  chapter,
  kicker,
  title,
  intro,
  aside,
  dark = false,
}: {
  chapter: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className={cn("border-b", dark ? "on-dark border-paper/15 bg-botanical text-paper" : "border-ink")}>
      <div className="site-gutter mx-auto grid max-w-site gap-10 pt-14 pb-16 md:pt-20 md:pb-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Kicker accent={chapter}>{kicker}</Kicker>
          <HeroTitleStatic>{title}</HeroTitleStatic>
          {intro && <div className={cn("mt-8 max-w-2xl text-lg leading-relaxed", dark ? "text-paper/80" : "text-ink/80")}>{intro}</div>}
        </div>
        {aside && <div className="self-end lg:col-span-4">{aside}</div>}
      </div>
    </header>
  );
}
