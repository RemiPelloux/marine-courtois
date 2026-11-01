/** Board geometry and motion timing, shared by the server board and the client pieces. */
export const CELL = 100;
/** Board edges are flat, so the margin only has to hold the outline stroke. */
export const PAD = 3;

/** Bleu Antibes shades per family; machine learning takes the brighter accent. */
export const FAMILY_FILL: Record<string, string> = {
  langages: "#0b2d4f",
  calcul: "#163f6b",
  ml: "#2468b3",
  donnees: "#1d4e80",
  visualisation: "#2b5c8e",
  partage: "#3a6a9b",
};

/** Seconds: how long a piece flies, and when it leaves — tools first, then the four axes, then the empty centre. */
export const FLIGHT = 0.9;
export function delayFor(order: number, tools: number) {
  if (order < tools) return 0.3 + order * 0.075;
  const j = order - tools;
  return 0.45 + tools * 0.075 + j * 0.14 + (j >= 4 ? 0.75 : 0);
}
