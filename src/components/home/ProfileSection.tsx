import { KineticTitle } from "@/components/editorial/KineticTitle";
import { ScrubText } from "@/components/editorial/ScrubText";
import { Reveal } from "@/components/editorial/Reveal";
import { PROFILE_DOMAINS } from "@/data/home";

/** Who she is, told through four ways of working rather than through a degree. */
export function ProfileSection() {
  return (
    <section aria-labelledby="profil" className="site-gutter mx-auto max-w-site scroll-mt-20 py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <KineticTitle as="h2" className="font-serif text-headline lg:col-span-5">
          <span id="profil">Un profil qui s&apos;adapte à la question.</span>
        </KineticTitle>
        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <ScrubText
            className="font-serif text-[1.6rem] leading-snug md:text-[1.85rem]"
            text="Mon travail va des équations différentielles aux simulations multi-agents, de l'analyse statistique au machine learning, de l'article scientifique au tableau de bord. Ce qui relie tout cela : partir d'une question concrète et construire l'outil qui y répond."
          />
        </Reveal>
      </div>
      <ul className="mt-20 grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {PROFILE_DOMAINS.map((d, i) => (
          <Reveal as="li" key={d.title} delay={i * 0.06} className={domainBorders(i)}>
            <h3 className="font-serif text-[2rem] leading-none">{d.title}</h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/80">{d.text}</p>
            <p className="mt-5 text-sm text-accent-deep">{d.tools.join(" · ")}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** Rules between cells: stacked on mobile, 2 × 2 on small screens, one row on large ones. */
function domainBorders(i: number) {
  return [
    "border-rule py-8 sm:px-6",
    i > 0 ? "border-t sm:border-t-0" : "",
    i % 2 === 1 ? "sm:border-l" : "",
    i >= 2 ? "sm:border-t lg:border-t-0" : "",
    i > 0 ? "lg:border-l" : "",
  ].join(" ");
}
