import { sectionCard, sectionMetadata, type LangParams } from "@/lib/og/sections";

export function generateImageMetadata({ params }: { params: LangParams }) {
  return sectionMetadata("outils", params);
}

export default function Image({ params }: { params: Promise<LangParams> }) {
  return sectionCard("outils", params);
}
