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

  // Ultra long range
  if (/g[5-7]\d{2}|gulfstream|global\s*(5|6|7|8)|falcon\s*(7|8|9)|bbj|acj/i.test(n)) return "ultra_long_range";

  // Heavy
  if (/challenger\s*(60|65)|legacy\s*(5|6)|falcon\s*(2|50|900)|lineage|global/i.test(n)) return "heavy";

  // Super midsize
  if (/challenger\s*(3|35)|citation\s*(x|sovereign|longitude)|praetor\s*(5|6)|hawker\s*4/i.test(n)) return "super_midsize";
  if (/super\s*mid/i.test(n)) return "super_midsize";

  // Midsize
  if (/hawker|learjet\s*(6|7)|citation\s*(xl|excel)|praetor\s*3|phenom\s*3|mid/i.test(n)) return "midsize";

  // Turboprop
  if (/king\s*air|pilatus|pc-?12|tbm|beech|turbo/i.test(n)) return "turboprop";

  // Light (default for jets)
  if (/citation|phenom|lear|cj[1-4]|hondajet|very\s*light|light/i.test(n)) return "light";

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
