import type { DomainId } from "@/data/competences";

/**
 * Which domain is selected, and how many times each domain has been picked
 * since the first render. A domain's count is the key of its pieces: when it
 * goes up, only that block remounts and reassembles; the others stay still.
 */
export type Selection = { selected: DomainId; drops: Partial<Record<DomainId, number>> };

export function selectDomain(state: Selection, id: DomainId): Selection {
  if (id === state.selected) return state;
  return { selected: id, drops: { ...state.drops, [id]: (state.drops[id] ?? 0) + 1 } };
}

/** Seconds: each piece of a reassembled block follows the previous one by DROP_STAGGER and takes DROP_TIME to land. */
export const DROP_STAGGER = 0.05;
export const DROP_TIME = 0.3;

export function dropDelay(step: number) {
  return Math.round(step * DROP_STAGGER * 1000) / 1000;
}
