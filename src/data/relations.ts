import { PUBLICATIONS, getPublication, getPublicationIn } from "@/data/publications";
import { COMMUNICATIONS, getCommunication } from "@/data/communications";
import { RESEARCH_THEMES, getResearchTheme, getResearchThemeIn } from "@/data/research";
import { RESEARCH_AXES, getResearchAxis } from "@/data/research-axes";
import { PROJECTS, PUBLIC_PROJECTS, projectsIn } from "@/data/projects";
import { EXPERIENCES } from "@/data/experiences";
import { FEATURES } from "@/data/features";
import { MEDIA, getMedia } from "@/data/media";
import { getSource } from "@/data/sources";
import { groupToolkit, type ToolkitEntry } from "@/data/toolkit";
import type { Project, ResearchAxis } from "@/types/portfolio";
import type { Lang } from "@/i18n/config";

/**
 * Typed relations between entities. Every page reads its links from here,
 * and `danglingReferences` (checked by the unit tests) guarantees that no id
 * points to nothing.
 */
const ALL_TOOLS: ToolkitEntry[] = groupToolkit("fr").flatMap((f) => f.tools);
export const getToolEntry = (id: string) => ALL_TOOLS.find((t) => t.id === id);

const defined = <T,>(xs: (T | undefined)[]) => xs.filter((x): x is T => x !== undefined);

/** Everything attached to an axis, in a language. Communications keep their HAL order (newest first). */
export function axisRelations(axis: ResearchAxis, lang: Lang = "fr") {
  return {
    themes: defined(axis.themeSlugs.map((slug) => getResearchThemeIn(lang, slug))),
    publications: defined(axis.publicationIds.map((id) => getPublicationIn(lang, id))),
    communications: COMMUNICATIONS.filter((c) => axis.communicationIds.includes(c.id)),
    projects: projectsIn(lang).filter((p) => axis.projectIds.includes(p.id)),
    tools: defined(axis.toolIds.map(getToolEntry)),
  };
}

export function projectRelations(project: Project) {
  return {
    tools: defined(project.toolIds.map(getToolEntry)),
    media: defined(project.mediaIds.map(getMedia)),
    publications: defined(project.publicationIds.map(getPublication)),
    axes: defined(project.axisIds.map(getResearchAxis)),
  };
}

/** Public projects that cite a publication. */
export const projectsForPublication = (publicationId: string, lang: Lang = "fr") =>
  projectsIn(lang).filter((p) => p.publicationIds.includes(publicationId));

/** Where a tool is put to work: public projects first, then research axes. */
export function toolRealizations(toolId: string) {
  return {
    projects: PUBLIC_PROJECTS.filter((p) => p.toolIds.includes(toolId)),
    axes: RESEARCH_AXES.filter((a) => a.toolIds.includes(toolId)),
  };
}

function check(errors: string[], owner: string, ids: string[], exists: (id: string) => unknown) {
  for (const id of ids) if (!exists(id)) errors.push(`${owner} → ${id}`);
}

function researchErrors(errors: string[]) {
  const projectIds = new Set(PROJECTS.map((p) => p.id));
  for (const a of RESEARCH_AXES) {
    check(errors, `axis ${a.id}`, a.themeSlugs, getResearchTheme);
    check(errors, `axis ${a.id}`, a.publicationIds, getPublication);
    check(errors, `axis ${a.id}`, a.communicationIds, getCommunication);
    check(errors, `axis ${a.id}`, a.projectIds, (id) => projectIds.has(id));
    check(errors, `axis ${a.id}`, a.toolIds, getToolEntry);
    check(errors, `axis ${a.id}`, a.sources, getSource);
  }
  for (const p of PUBLICATIONS) check(errors, `publication ${p.id}`, p.researchSlugs, getResearchTheme);
  for (const t of RESEARCH_THEMES) {
    const owners = RESEARCH_AXES.filter((a) => a.themeSlugs.includes(t.slug)).length;
    if (owners !== 1) errors.push(`theme ${t.slug}: ${owners} axes`);
  }
}

/** Every id that does not resolve, as "owner → id". Empty when the content is consistent. */
export function danglingReferences(): string[] {
  const errors: string[] = [];
  researchErrors(errors);
  for (const p of PROJECTS) {
    check(errors, `project ${p.id}`, p.toolIds, getToolEntry);
    check(errors, `project ${p.id}`, p.mediaIds, getMedia);
    check(errors, `project ${p.id}`, p.publicationIds, getPublication);
    check(errors, `project ${p.id}`, p.axisIds, getResearchAxis);
    check(errors, `project ${p.id}`, p.sources, getSource);
  }
  for (const e of EXPERIENCES) check(errors, `experience ${e.id}`, e.sources, getSource);
  for (const f of FEATURES) {
    check(errors, `feature ${f.id}`, [f.communicationId], getCommunication);
    check(errors, `feature ${f.id}`, f.mediaIds, getMedia);
  }
  for (const c of COMMUNICATIONS) if (c.featureId) check(errors, `communication ${c.id}`, [c.featureId], (id) => FEATURES.some((f) => f.id === id));
  if (new Set(MEDIA.map((m) => m.id)).size !== MEDIA.length) errors.push("media: duplicate id");
  return errors;
}
