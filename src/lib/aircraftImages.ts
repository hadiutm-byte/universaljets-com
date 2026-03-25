import lightJet from "@/assets/aircraft/light-jet.jpg";
import midsizeJet from "@/assets/aircraft/midsize-jet.jpg";
import superMidsizeJet from "@/assets/aircraft/super-midsize-jet.jpg";
import heavyJet from "@/assets/aircraft/heavy-jet.jpg";
import ultraLongRange from "@/assets/aircraft/ultra-long-range.jpg";
import turboprop from "@/assets/aircraft/turboprop.jpg";

type AircraftCategory = "light" | "midsize" | "super_midsize" | "heavy" | "ultra_long_range" | "turboprop";

const categoryImages: Record<AircraftCategory, string> = {
  light: lightJet,
  midsize: midsizeJet,
  super_midsize: superMidsizeJet,
  heavy: heavyJet,
  ultra_long_range: ultraLongRange,
  turboprop: turboprop,
};

const categoryLabels: Record<AircraftCategory, string> = {
  light: "Light Jet",
  midsize: "Midsize Jet",
  super_midsize: "Super Midsize",
  heavy: "Heavy Jet",
  ultra_long_range: "Ultra Long Range",
  turboprop: "Turboprop",
};

/** Match aircraft name/type string to a category */
function classifyAircraft(name: string): AircraftCategory {
  const n = name.toLowerCase();

  // Turboprop — check early to avoid false matches
  if (/king\s*air|pilatus|pc-?12|pc-?24|tbm|beech|turbo|dash|atr|saab|dornier|piaggio/i.test(n)) return "turboprop";

  // Ultra long range
  if (/g[5-7]\d{2}|gulfstream\s*(g|iv|v|vi|650|550|500|700)|global\s*(5|6|7|8)|falcon\s*(7x|8x|900|6x|10x)|bbj|acj|lineage/i.test(n)) return "ultra_long_range";

  // Heavy
  if (/challenger\s*(60|65|850)|legacy\s*(5|6|450|500|600)|falcon\s*(2000|50|900)|global|embraer\s*l/i.test(n)) return "heavy";

  // Super midsize
  if (/challenger\s*(3|300|350)|citation\s*(x|sovereign|longitude)|praetor\s*(5|6)|hawker\s*4|gulfstream\s*(g(2|3|280|150))|legacy\s*(4|450)/i.test(n)) return "super_midsize";
  if (/super\s*mid/i.test(n)) return "super_midsize";

  // Midsize
  if (/hawker|learjet\s*(6|7|45|55|60|75)|citation\s*(xl|xls|excel|latitude)|praetor\s*(3|300)|phenom\s*3|mid|lear\s*75|lear\s*60/i.test(n)) return "midsize";

  // Light
  if (/citation\s*(cj|mustang|m2|encore|bravo|ultra|v\b)|phenom\s*(1|100|300)|lear\s*(25|31|35|40)|learjet\s*(25|31|35|40)|cj[1-4]|hondajet|very\s*light|light|premier|beechjet|nextant/i.test(n)) return "light";
  if (/cessna\s*citation/i.test(n)) return "light";

  // Keyword fallbacks
  if (/heavy/i.test(n)) return "heavy";
  if (/light/i.test(n)) return "light";

  // Fallback: midsize
  return "midsize";
}

/** Get the aircraft image for a given aircraft name/type string */
export function getAircraftImage(aircraftName: string): string {
  const cat = classifyAircraft(aircraftName);
  return categoryImages[cat];
}

/** Get a human-readable category label */
export function getAircraftCategory(aircraftName: string): string {
  const cat = classifyAircraft(aircraftName);
  return categoryLabels[cat];
}

export { categoryImages, categoryLabels };
export type { AircraftCategory };
