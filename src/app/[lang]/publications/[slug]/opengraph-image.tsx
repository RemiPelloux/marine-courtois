import { notFound } from "next/navigation";
import type { Lang } from "@/i18n/config";
import { getPublicationIn } from "@/data/publications";
import { renderCard } from "@/lib/og/card";
import { langParam, slugCardMetadata, type SlugParams } from "@/lib/og/meta";
import { DETAIL_LABEL } from "@/lib/og/sections";

/** Same title as the page metadata: the editorial title when there is one. */
function titleOf(lang: Lang, slug: string) {
  const p = getPublicationIn(lang, slug);
  return p && (p.editorialTitle ?? p.title);
}

export function generateImageMetadata({ params }: { params: SlugParams }) {
  return slugCardMetadata(params, "puzzle", titleOf);
}

export default async function Image({ params }: { params: Promise<SlugParams> }) {
  const { lang: value, slug = "" } = await params;
  const lang = langParam(value);
  const title = titleOf(lang, slug);
  if (!title) notFound();
  return renderCard({ lang, title, motif: "puzzle", label: DETAIL_LABEL.publication[lang] });
}
