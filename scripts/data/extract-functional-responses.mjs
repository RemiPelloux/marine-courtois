// Extracts the functional-response estimates analysed in Courtois et al. (2026, J. Anim. Ecol.)
// from the Zenodo deposit (doi:10.5281/zenodo.18377688, CC BY 4.0).
//   node scripts/data/extract-functional-responses.mjs path/to/FR_data_invasive.csv
// Same subset as Main_Script.R: 3D arenas, a known temperature, and a species
// type / sampling area that maps to one of the three groups → 269 rows, 45 species.
import { readFileSync, writeFileSync } from "node:fs";

const [csvPath] = process.argv.slice(2);
if (!csvPath) throw new Error("usage: extract-functional-responses.mjs FR_data_invasive.csv");

function parseLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ";" && !quoted) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const num = (s) => {
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) && s !== "" ? n : null;
};

/** NIS: non-invasive species; ISNR / ISIR: invasive species sampled in their native / invasion range. */
function group(type, area) {
  if (type === "non invasive" && area === "native") return "NIS";
  if (type === "invasive" && area === "native") return "ISNR";
  if (type === "invasive" && area === "invasive") return "ISIR";
  return null;
}

const [header, ...lines] = readFileSync(csvPath, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
const cols = parseLine(header).map((c) => c.trim());
const idx = (name) => cols.indexOf(name);
const rows = lines
  .map(parseLine)
  .map((r) => ({
    species: r[idx("predator_scientific_name")],
    group: group(r[idx("species_type")], r[idx("sampling_area")]),
    dim: num(r[idx("dim")]),
    temp: num(r[idx("temp_celsius")]),
    a: num(r[idx("fitted_a_median_of_BS_samples")]),
    h: num(r[idx("fitted_h_day")]),
  }))
  .filter((r) => r.group && r.dim === 3 && r.temp !== null && r.a > 0 && r.h > 0)
  .map(({ species, group, temp, a, h }) => ({ species, group, temp, a: Number(a.toPrecision(4)), h: Number(h.toPrecision(4)) }));

const species = new Set(rows.map((r) => r.species));
const out = {
  source: "Courtois et al. 2026, Journal of Animal Ecology — Zenodo 10.5281/zenodo.18377688 (CC BY 4.0)",
  units: { a: "m³ par prédateur et par jour", h: "jour", temp: "°C" },
  observations: rows.length,
  species: species.size,
  rows,
};
writeFileSync("src/data/generated/functional-responses.json", JSON.stringify(out));
console.log(`${rows.length} observations, ${species.size} species`);
