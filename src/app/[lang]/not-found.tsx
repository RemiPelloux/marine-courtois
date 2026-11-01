import { copy } from "@/i18n/config";
import { getLang } from "@/i18n/server";
import { ButtonLink } from "@/components/ui/Links";
import { Kicker } from "@/components/ui/Kicker";

const COPY = copy({
  fr: {
    kicker: "Page introuvable",
    title: "Cette trajectoire ne mène nulle part.",
    text: "La page demandée n'existe pas ou a été déplacée.",
    home: "Retour à l'accueil",
  },
  en: {
    kicker: "Page not found",
    title: "This trajectory leads nowhere.",
    text: "The page you asked for does not exist or has moved.",
    home: "Back to the home page",
  },
});

export default async function NotFound() {
  const t = COPY[await getLang()];
  return (
    <section className="site-gutter mx-auto flex min-h-[60vh] max-w-site flex-col justify-center py-24">
      <Kicker accent="404">{t.kicker}</Kicker>
      <h1 className="mt-6 max-w-3xl font-serif text-headline">{t.title}</h1>
      <p className="mt-6 max-w-xl text-lg text-ink/80">{t.text}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">{t.home}</ButtonLink>
        <ButtonLink href="/publications" variant="secondary">
          Publications
        </ButtonLink>
      </div>
    </section>
  );
}
