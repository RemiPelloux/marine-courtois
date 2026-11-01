import { groupToolkit, type ToolkitEntry } from "@/data/toolkit";
import { ACTIVITY_AXES, type ActivityAxis } from "@/data/axes";
import { layoutPuzzle, GRID, type Slot } from "@/lib/puzzle/layout";
import { pieceBumps, piecePath } from "@/lib/puzzle/geometry";
import { CELL, PAD } from "@/components/puzzle/constants";

export const VIEW = GRID * CELL + PAD * 2;

export type PuzzleTool = ToolkitEntry & { familyLabel: string };
export type PuzzleSlot = Slot<PuzzleTool, ActivityAxis> & { path: string };

/** The whole board, built on the server and handed to the client puzzle as plain data. */
export function buildBoard() {
  const grouped = groupToolkit();
  const tools: PuzzleTool[] = grouped.flatMap((f) => f.tools.map((t) => ({ ...t, familyLabel: f.label })));
  const slots = layoutPuzzle(tools, ACTIVITY_AXES).map((s) => ({ ...s, path: piecePath(pieceBumps(s.r, s.c, GRID, GRID), CELL) }));
  const families = grouped.map((f) => ({ id: f.id, label: f.label, count: f.tools.length }));
  return { families, tools, axes: ACTIVITY_AXES, slots: slots as PuzzleSlot[], view: VIEW };
}

export type Board = ReturnType<typeof buildBoard>;
