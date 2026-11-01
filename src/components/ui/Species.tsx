import { Fragment } from "react";

/**
 * Binomials that appear in data strings (titles of talks, career entries,
 * competences). Scientific names are set in italics; data stays plain text.
 */
export const SPECIES = ["Drosophila suzukii", "Ceratitis capitata", "D. suzukii", "C. capitata"] as const;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERN = new RegExp(`(${SPECIES.map(escape).join("|")})`, "g");

export type SpeciesPart = { text: string; italic: boolean };

/** "SIT against Ceratitis capitata" → [{ "SIT against ", false }, { "Ceratitis capitata", true }]. */
export function splitSpecies(text: string): SpeciesPart[] {
  return text
    .split(PATTERN)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, italic: (SPECIES as readonly string[]).includes(part) }));
}

/** A string with its known species names in italics. */
export function SpeciesText({ text }: { text: string }) {
  return (
    <>
      {splitSpecies(text).map((p, i) => (p.italic ? <i key={i}>{p.text}</i> : <Fragment key={i}>{p.text}</Fragment>))}
    </>
  );
}
