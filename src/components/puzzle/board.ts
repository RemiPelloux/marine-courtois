import { groupToolkit, type ToolkitEntry } from "@/data/toolkit";
import { domainsIn, type Domain } from "@/data/domains";
import { layoutPuzzle, COLS, ROWS, type Slot } from "@/lib/puzzle/layout";
import { pieceBumps, piecePath } from "@/lib/puzzle/geometry";
import { CELL, PAD } from "@/components/puzzle/constants";
import type { Lang } from "@/i18n/config";

/** SVG viewBox size, board plus the stroke margin on each side. */
export const VIEW = { width: COLS * CELL + PAD * 2, height: ROWS * CELL + PAD * 2 };

export type PuzzleTool = ToolkitEntry & { familyLabel: string };
export type PuzzleSlot = Slot<PuzzleTool, Domain> & { path: string };

/** The whole board in a language, built on the server and handed to the client puzzle as plain data. */
export function buildBoard(lang: Lang) {
  const grouped = groupToolkit(lang);
  const tools: PuzzleTool[] = grouped.flatMap((f) => f.tools.map((t) => ({ ...t, familyLabel: f.label })));
  const domains = domainsIn(lang);
  const slots = layoutPuzzle(tools, domains).map((s) => ({ ...s, path: piecePath(pieceBumps(s.r, s.c, ROWS, COLS), CELL) }));
  const families = grouped.map((f) => ({ id: f.id, label: f.label, count: f.tools.length }));
  return { families, tools, domains, slots: slots as PuzzleSlot[], view: VIEW };
}

export type Board = ReturnType<typeof buildBoard>;
