import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Fonts of the share images: the site's Instrument Serif and Montserrat, vendored as
 * static TTF (SIL OFL, licences beside them) because the image renderer reads neither
 * woff2 nor system fonts. Read once per server process.
 */
const DIR = join(process.cwd(), "src/lib/og/fonts");

const [serif, serifItalic, sans] = await Promise.all(
  ["InstrumentSerif-Regular.ttf", "InstrumentSerif-Italic.ttf", "Montserrat-Medium.ttf"].map((file) => readFile(join(DIR, file))),
);

export const SERIF = "Instrument Serif";
export const SANS = "Montserrat";

export const OG_FONTS = [
  { name: SERIF, data: serif, style: "normal" as const, weight: 400 as const },
  { name: SERIF, data: serifItalic, style: "italic" as const, weight: 400 as const },
  { name: SANS, data: sans, style: "normal" as const, weight: 500 as const },
];
