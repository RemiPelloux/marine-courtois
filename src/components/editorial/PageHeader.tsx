import { Kicker } from "@/components/ui/Kicker";
import { KineticTitle } from "@/components/editorial/KineticTitle";
import { ViewTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Interior page header: chapter label, large serif title, intro, optional aside. */
export function PageHeader({
  chapter,
  kicker,
  title,
  intro,
  aside,
  dark = false,
  morphName,
}: {
  chapter: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
  /** shared-element name: the title morphs from the list entry that linked here, instead of rising line by line */
  morphName?: string;
}) {
  return (
    <header className={cn("border-b", dark ? "on-dark border-paper/15 bg-antibes text-paper" : "border-ink")}>
      <div className="site-gutter mx-auto grid max-w-site gap-10 pt-14 pb-16 md:pt-20 md:pb-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Kicker accent={chapter}>{kicker}</Kicker>
          <PageTitle morphName={morphName}>{title}</PageTitle>
          {intro && <div className={cn("mt-8 max-w-2xl text-lg leading-relaxed", dark ? "text-paper/80" : "text-ink/80")}>{intro}</div>}
        </div>
        {aside && <div className="self-end lg:col-span-4">{aside}</div>}
      </div>
    </header>
  );
}

/** Morphs from the list entry that linked here when named, otherwise rises line by line. */
function PageTitle({ morphName, children }: { morphName?: string; children: ReactNode }) {
  if (!morphName) {
    return (
      <KineticTitle as="h1" trigger="load" className="mt-7 font-serif text-headline">
        {children}
      </KineticTitle>
    );
  }
  return (
    <h1 className="mt-7 font-serif text-headline">
      <ViewTransition name={morphName} share="morph" default="none">
        <span className="inline-block">{children}</span>
      </ViewTransition>
    </h1>
  );
}
