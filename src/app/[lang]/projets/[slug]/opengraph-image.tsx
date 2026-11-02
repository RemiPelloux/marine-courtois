import { notFound } from "next/navigation";
import type { Lang } from "@/i18n/config";
import { getProjectIn } from "@/data/projects";
import { renderCard } from "@/lib/og/card";
import { langParam, slugCardMetadata, type SlugParams } from "@/lib/og/meta";
import { DETAIL_LABEL } from "@/lib/og/sections";

/** Public projects only: getProjectIn never returns a draft, so drafts get no image. */
const titleOf = (lang: Lang, slug: string) => getProjectIn(lang, slug)?.title;

export function generateImageMetadata({ params }: { params: SlugParams }) {
  return slugCardMetadata(params, "puzzle", titleOf);
}

export default async function Image({ params }: { params: Promise<SlugParams> }) {
  const { lang: value, slug = "" } = await params;
  const lang = langParam(value);
  const title = titleOf(lang, slug);
  if (!title) notFound();
  return renderCard({ lang, title, motif: "puzzle", label: DETAIL_LABEL.project[lang] });
}
