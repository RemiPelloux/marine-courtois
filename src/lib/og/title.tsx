import { splitSpecies } from "@/components/ui/Species";
import { SERIF } from "@/lib/og/fonts";

export type Word = { text: string; italic: boolean };

/** Punctuation that French sets after a non-breaking space: it never starts a line. */
const TRAILING = /^[?!:;»]+$/;

/**
 * Words of a title, species names flagged for italics. The card lays words out with
 * flex-wrap, so a lone "?" or ":" is glued to the word before it.
 */
export function titleWords(text: string): Word[] {
  const words: Word[] = [];
  for (const part of splitSpecies(text)) {
    for (const w of part.text.split(/\s+/).filter(Boolean)) {
      const prev = words.at(-1);
      if (prev && TRAILING.test(w)) prev.text += `\u00a0${w}`;
      else words.push({ text: w, italic: part.italic });
    }
  }
  return words;
}

/** Font size that keeps the longest titles (about 100 characters) within four lines. */
export function titleSize(text: string): number {
  const n = text.length;
  if (n <= 14) return 124;
  if (n <= 30) return 92;
  if (n <= 50) return 74;
  if (n <= 80) return 62;
  return 54;
}

export function Title({ text, color }: { text: string; color: string }) {
  const size = titleSize(text);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.2, fontFamily: SERIF, fontSize: size, lineHeight: 1.02, color }}>
      {titleWords(text).map((w, i) => (
        <span key={i} style={{ fontStyle: w.italic ? "italic" : "normal" }}>
          {w.text}
        </span>
      ))}
    </div>
  );
}
