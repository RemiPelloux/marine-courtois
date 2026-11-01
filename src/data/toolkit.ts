import { declaredToolSchema, TOOL_FAMILIES, type DeclaredTool } from "@/types/content";
import type { z } from "zod";
import type { Copy, Lang } from "@/i18n/config";
import { localizeById } from "@/i18n/localize";
import { EN_DECLARED } from "@/data/en/tools";
import { toolsIn } from "@/data/skills";

/**
 * Tools supplied by the site owner (2026-11-01). They do not appear in Marine's
 * public code (GitLab, Zenodo), so they carry no code evidence and are shown apart from TOOLS.
 * Roles describe the tool itself, not a project: add project details only with a source.
 */
const RAW_DECLARED: z.input<typeof declaredToolSchema>[] = [
  { id: "r-shiny", name: "R Shiny", role: "Applications web interactives écrites en R", family: "visualisation" },
  { id: "mysql", name: "MySQL", role: "Bases de données relationnelles, requêtes SQL", family: "donnees" },
  { id: "power-bi", name: "Power BI", role: "Tableaux de bord et rapports de données", family: "visualisation" },
  { id: "scikit-learn", name: "scikit-learn", role: "Apprentissage automatique : régression, classification, clustering", family: "ml" },
  { id: "pytorch", name: "PyTorch", role: "Réseaux de neurones et apprentissage profond", family: "ml" },
  { id: "tensorflow", name: "TensorFlow / Keras", role: "Réseaux de neurones et apprentissage profond", family: "ml" },
  { id: "boosting", name: "XGBoost / LightGBM", role: "Gradient boosting sur données tabulaires", family: "ml" },
];

export const DECLARED_TOOLS: DeclaredTool[] = RAW_DECLARED.map((t) => declaredToolSchema.parse(t));

export const FAMILY_LABELS: Record<(typeof TOOL_FAMILIES)[number], Copy<string>> = {
  langages: { fr: "Langages", en: "Languages" },
  calcul: { fr: "Calcul et modélisation", en: "Computing and modelling" },
  ml: { fr: "Machine learning", en: "Machine learning" },
  donnees: { fr: "Données", en: "Data" },
  visualisation: { fr: "Visualisation et restitution", en: "Visualisation and reporting" },
  partage: { fr: "Environnement et partage", en: "Environment and sharing" },
};

export type ToolkitEntry = DeclaredTool & { inPublicCode: boolean };
export type ToolkitFamily = { id: (typeof TOOL_FAMILIES)[number]; label: string; tools: ToolkitEntry[] };

/** Every tool grouped by family, in a language; tools proven in public code come first in each family. */
export function groupToolkit(lang: Lang): ToolkitFamily[] {
  const entries: ToolkitEntry[] = [
    ...toolsIn(lang).map((t) => ({ id: t.id, name: t.name, role: t.role, family: t.family, inPublicCode: true })),
    ...localizeById(DECLARED_TOOLS, EN_DECLARED, lang).map((t) => ({ ...t, inPublicCode: false })),
  ];
  return TOOL_FAMILIES.map((id) => ({
    id,
    label: FAMILY_LABELS[id][lang],
    tools: entries.filter((e) => e.family === id),
  })).filter((f) => f.tools.length > 0);
}

/** Every tool, flat, in a language. */
export const toolEntriesIn = (lang: Lang) => groupToolkit(lang).flatMap((f) => f.tools);
