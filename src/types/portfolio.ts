import { z } from "zod";

/**
 * Portfolio entities that sit around the publications: career pieces, research
 * axes and open questions, teaching, projects and their experiments, media.
 * Relations are plain ids, resolved and checked in src/data/relations.ts.
 */

/** How far along a project or question really is. */
export const MATURITY = ["publie", "en-cours", "prototype", "exploration", "demo", "archive"] as const;
export type Maturity = (typeof MATURITY)[number];

/** draft and private entries are kept in the data but never rendered. */
export const VISIBILITY = ["public", "draft", "private"] as const;

const link = z.object({ label: z.string(), url: z.string() });

export const mediaAssetSchema = z.object({
  id: z.string(),
  kind: z.enum(["image", "video", "gif"]),
  src: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(12),
  caption: z.string(),
  credit: z.string().optional(),
  /** still frame shown before a video plays */
  poster: z.string().optional(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const EXPERIENCE_KINDS = ["formation", "experience", "doctorat", "collaboration", "publication", "communication", "competence"] as const;

export const experienceSchema = z.object({
  id: z.string(),
  kind: z.enum(EXPERIENCE_KINDS),
  /** label printed on the puzzle piece — a few words */
  label: z.string().max(18),
  title: z.string(),
  /** "YYYY", "YYYY-MM" or "YYYY-MM-DD"; skills carry no date */
  date: z.string().regex(/^\d{4}(-\d{2}){0,2}$/).optional(),
  endDate: z.string().optional(),
  place: z.string().optional(),
  detail: z.string(),
  href: z.string().optional(),
  sources: z.array(z.string()).min(1),
});
export type Experience = z.infer<typeof experienceSchema>;

export const researchAxisSchema = z.object({
  id: z.string(),
  letter: z.enum(["A", "B", "C", "D"]),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  lede: z.string(),
  themeSlugs: z.array(z.string()),
  publicationIds: z.array(z.string()),
  communicationIds: z.array(z.string()),
  projectIds: z.array(z.string()),
  toolIds: z.array(z.string()),
});
export type ResearchAxis = z.infer<typeof researchAxisSchema>;

export const researchQuestionSchema = z.object({
  id: z.string(),
  axisId: z.string(),
  question: z.string(),
  context: z.string(),
  status: z.enum(MATURITY),
  visibility: z.enum(VISIBILITY),
  sources: z.array(z.string()).min(1),
});
export type ResearchQuestion = z.infer<typeof researchQuestionSchema>;

export const teachingActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  institution: z.string(),
  level: z.string(),
  period: z.string(),
  format: z.string(),
  hours: z.number().optional(),
  objectives: z.array(z.string()),
  methods: z.array(z.string()),
  supports: z.array(link),
  relatedModuleIds: z.array(z.string()).default([]),
  visibility: z.enum(VISIBILITY),
});
export type TeachingActivity = z.infer<typeof teachingActivitySchema>;

export const experimentSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  method: z.string(),
  /** what was actually observed — preliminary unless the project is published */
  outcome: z.string(),
  status: z.enum(MATURITY),
});
export type Experiment = z.infer<typeof experimentSchema>;

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  tagline: z.string(),
  kind: z.enum(["application", "modele", "analyse", "outil", "deep-learning", "visualisation"]),
  status: z.enum(MATURITY),
  visibility: z.enum(VISIBILITY),
  featured: z.boolean().default(false),
  context: z.string(),
  question: z.string(),
  methods: z.array(z.string()),
  toolIds: z.array(z.string()),
  /** results the project has actually demonstrated */
  results: z.array(z.string()),
  limits: z.array(z.string()),
  nextSteps: z.array(z.string()),
  links: z.array(link),
  /** a demo hosted elsewhere (Shiny, notebook server…) */
  demoUrl: z.url().optional(),
  /** a demo built into this site */
  internalDemo: z.enum(["abm", "explorer", "fish"]).optional(),
  mediaIds: z.array(z.string()).default([]),
  publicationIds: z.array(z.string()).default([]),
  axisIds: z.array(z.string()).default([]),
  experiments: z.array(experimentSchema).default([]),
  sources: z.array(z.string()).min(1),
});
export type Project = z.infer<typeof projectSchema>;

export const MATURITY_LABEL: Record<Maturity, string> = {
  publie: "Publié",
  "en-cours": "Recherche en cours",
  prototype: "Prototype",
  exploration: "Exploration",
  demo: "Démonstration disponible",
  archive: "Archivé",
};
