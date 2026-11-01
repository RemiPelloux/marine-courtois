import { declaredToolSchema, TOOL_FAMILIES, type DeclaredTool } from "@/types/content";
import { TOOLS } from "@/data/skills";
import type { z } from "zod";

/**
 * Tools supplied by the site owner (2026-11-01). They do not appear in Marine's
 * public repositories, so they carry no code evidence and are shown apart from TOOLS.
 * Roles describe the tool itself, not a project: add project details only with a source.
 */
const RAW_DECLARED: z.input<typeof declaredToolSchema>[] = [
  { id: "r", name: "R", role: "Langage d'analyse statistique et de modélisation", family: "langages" },
  { id: "r-shiny", name: "R Shiny", role: "Applications web interactives écrites en R", family: "visualisation" },
  { id: "mysql", name: "MySQL", role: "Bases de données relationnelles, requêtes SQL", family: "donnees" },
  { id: "power-bi", name: "Power BI", role: "Tableaux de bord et rapports de données", family: "visualisation" },
  { id: "scikit-learn", name: "scikit-learn", role: "Apprentissage automatique : régression, classification, clustering", family: "ml" },
  { id: "pytorch", name: "PyTorch", role: "Réseaux de neurones et apprentissage profond", family: "ml" },
  { id: "tensorflow", name: "TensorFlow / Keras", role: "Réseaux de neurones et apprentissage profond", family: "ml" },
  { id: "boosting", name: "XGBoost / LightGBM", role: "Gradient boosting sur données tabulaires", family: "ml" },
];

export const DECLARED_TOOLS: DeclaredTool[] = RAW_DECLARED.map((t) => declaredToolSchema.parse(t));

export const FAMILY_LABELS: Record<(typeof TOOL_FAMILIES)[number], string> = {
  langages: "Langages",
  calcul: "Calcul et modélisation",
  ml: "Machine learning",
  donnees: "Données",
  visualisation: "Visualisation et restitution",
  partage: "Environnement et partage",
};

export type ToolkitEntry = DeclaredTool & { inPublicCode: boolean };
export type ToolkitFamily = { id: (typeof TOOL_FAMILIES)[number]; label: string; tools: ToolkitEntry[] };

/** Every tool grouped by family; tools proven in public code come first in each family. */
export function groupToolkit(): ToolkitFamily[] {
  const entries: ToolkitEntry[] = [
    ...TOOLS.map((t) => ({ id: t.id, name: t.name, role: t.role, family: t.family, inPublicCode: true })),
    ...DECLARED_TOOLS.map((t) => ({ ...t, inPublicCode: false })),
  ];
  return TOOL_FAMILIES.map((id) => ({
    id,
    label: FAMILY_LABELS[id],
    tools: entries.filter((e) => e.family === id),
  })).filter((f) => f.tools.length > 0);
}
