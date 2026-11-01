import { ButtonLink } from "@/components/ui/Links";
import { Kicker } from "@/components/ui/Kicker";

export default function NotFound() {
  return (
    <section className="site-gutter mx-auto flex min-h-[60vh] max-w-site flex-col justify-center py-24">
      <Kicker accent="404">Page introuvable</Kicker>
      <h1 className="mt-6 max-w-3xl font-serif text-headline">
        Cette trajectoire ne mène nulle part.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink/80">La page demandée n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/publications" variant="secondary">Publications</ButtonLink>
      </div>
    </section>
  );
}
