import { z } from "zod";

/**
 * Content schemas — single source of truth for every editorial entry.
 * Every scientific entry references at least one `SourceId` (see src/data/sources.ts).
 */

export const sourceSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.url(),
  kind: z.enum(["article", "repository", "registry", "thesis", "dataset", "report", "archive", "preprint"]),
  /** what this source is used to verify */
  verifies: z.string(),
});
export type Source = z.infer<typeof sourceSchema>;

export const publicationSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  editorialTitle: z.string().optional(),
  authors: z.array(z.string()).min(1),
  authorNote: z.string().optional(),
  year: z.number().int().min(2000),
  date: z.string().optional(),
  journal: z.string().optional(),
  volume: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional(),
  abstract: z.string().optional(),
  summaryFr: z.string(),
  questionFr: z.string(),
  approachFr: z.string(),
  themes: z.array(z.string()).min(1),
  publicationType: z.enum(["article", "these", "preprint"]),
  sourceUrl: z.url(),
  pdfUrl: z.url().optional(),
  codeUrl: z.url().optional(),
  datasetUrl: z.url().optional(),
  extraLinks: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  license: z.string().optional(),
  featured: z.boolean(),
  researchSlugs: z.array(z.string()),
  sources: z.array(z.string()).min(1),
});
export type Publication = z.infer<typeof publicationSchema>;

export const communicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["communication", "poster"]),
  event: z.string(),
  place: z.string(),
  date: z.string(),
  authors: z.array(z.string()),
  halId: z.string(),
  url: z.url(),
  themes: z.array(z.string()),
});
export type Communication = z.infer<typeof communicationSchema>;

export const researchThemeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.string(),
  title: z.string(),
  short: z.string(),
  lede: z.string(),
  question: z.string(),
  mechanism: z.string(),
  approach: z.string(),
  keyConcept: z.object({ term: z.string(), definition: z.string() }),
  methods: z.array(z.string()),
  publicationIds: z.array(z.string()),
  thesisChapter: z.number().int().optional(),
  codeFileIds: z.array(z.string()),
  figureId: z.string().optional(),
  explorerTab: z.enum(["fertilite", "accouplements", "dynamique"]).optional(),
  sources: z.array(z.string()).min(1),
});
export type ResearchTheme = z.infer<typeof researchThemeSchema>;

export const TOOL_FAMILIES = ["langages", "calcul", "ml", "donnees", "visualisation", "partage"] as const;

export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  family: z.enum(TOOL_FAMILIES),
  /** files in which the tool is actually imported or used */
  evidence: z.array(z.string()).min(1),
  versionNote: z.string().optional(),
});
export type Tool = z.infer<typeof toolSchema>;

/** A tool the user states Marine works with, but which is absent from her public code. */
export const declaredToolSchema = toolSchema.pick({ id: true, name: true, role: true, family: true });
export type DeclaredTool = z.infer<typeof declaredToolSchema>;

export const capabilitySchema = z.object({
  id: z.string(),
  index: z.string(),
  title: z.string(),
  description: z.string(),
  stage: z.enum(["formaliser", "simuler", "interpreter", "partager"]),
  evidenceLabel: z.string(),
  publicationIds: z.array(z.string()),
  researchSlugs: z.array(z.string()),
  toolIds: z.array(z.string()),
  visual: z.enum(["phase", "agents", "distribution", "equations", "sensitivity", "repository"]),
  links: z.array(z.object({ label: z.string(), url: z.url() })),
});
export type Capability = z.infer<typeof capabilitySchema>;

export const figureSchema = z.object({
  id: z.string(),
  src: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  caption: z.string(),
  notebook: z.string(),
  repository: z.enum(["thesisData", "sit_remating_abm"]),
});
export type Figure = z.infer<typeof figureSchema>;

export const codeFileSchema = z.object({
  id: z.string(),
  repository: z.enum(["thesisData", "sit_remating_abm"]),
  path: z.string(),
  kind: z.enum(["notebook", "script", "data", "document", "archive"]),
  chapter: z.number().int().optional(),
  description: z.string(),
  language: z.string().optional(),
  pythonVersion: z.string().optional(),
  imports: z.array(z.string()).default([]),
  excerpt: z
    .object({ label: z.string(), code: z.string(), note: z.string().optional() })
    .optional(),
  figureIds: z.array(z.string()).default([]),
});
export type CodeFile = z.infer<typeof codeFileSchema>;

export const thesisChapterSchema = z.object({
  number: z.number().int(),
  folder: z.string(),
  title: z.string(),
  titleFr: z.string(),
  question: z.string(),
  approach: z.string(),
  keyConcept: z.string(),
  accessible: z.string(),
  publicationIds: z.array(z.string()),
  codeFileIds: z.array(z.string()),
  figureId: z.string().optional(),
  sources: z.array(z.string()).min(1),
});
export type ThesisChapter = z.infer<typeof thesisChapterSchema>;
