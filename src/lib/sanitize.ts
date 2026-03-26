/**
 * Centralized B2C aircraft data sanitization.
 *
 * Every public-facing component MUST pipe aircraft data through these helpers
 * before rendering.  Internal CRM views may bypass them.
 *
 * What is stripped:
 *  - tail_number / registration / aircraft_identifier / operator_aircraft_code
 *  - operator name / company name
 *  - bracketed registration suffixes in aircraft names, e.g. "(HA-JEX)"
 *  - images whose type is "tail" or "registration"
 */

// ── Registration pattern ────────────────────────────────────────────────────
// Matches common ICAO-style registrations: HA-JEX, D-IRBS, N123AB, G-ABCD,
// VP-BNR, A6-FLJ, 9H-VCA, etc.  Also catches generic alphanumeric codes
// that look like tail/reg numbers when wrapped in parens.
const REG_IN_PARENS = /\s*\([A-Z0-9]{1,4}-[A-Z0-9]{2,5}\)\s*/gi;
const REG_STANDALONE = /\b[A-Z]{1,2}-[A-Z]{2,5}\b/g;

// ── Blocked image types ─────────────────────────────────────────────────────
const BLOCKED_IMAGE_TYPES = new Set(["tail", "registration"]);

// ── Public sanitisation helpers ─────────────────────────────────────────────

/** Strip bracketed registration from an aircraft display name. */
export function sanitizeAircraftName(name: string | null | undefined): string {
  if (!name) return "Private Jet";
  return name.replace(REG_IN_PARENS, "").trim() || "Private Jet";
}

/** Remove any standalone registration code from a generic text field. */
export function stripRegistration(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(REG_STANDALONE, "").replace(/\s{2,}/g, " ").trim();
}

/** Fields that must NEVER appear in public-facing data. */
const PRIVATE_KEYS = new Set([
  "tail_number",
  "registration",
  "reg_number",
  "aircraft_identifier",
  "operator_aircraft_code",
  "operator",
  "operator_name",
  "company",
  "company_name",
  "operator_id",
  "operator_icao",
]);

/**
 * Deep-sanitize a record for B2C display.
 * Removes private keys and cleans aircraft names.
 */
export function sanitizeForPublic<T extends Record<string, unknown>>(raw: T): Partial<T> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (PRIVATE_KEYS.has(key)) continue;

    if (key === "aircraft_type" || key === "aircraft_name" || key === "aircraft") {
      cleaned[key] = sanitizeAircraftName(value as string);
    } else if (typeof value === "string") {
      cleaned[key] = value;
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned as Partial<T>;
}

/**
 * Filter aircraft images array, removing tail/registration photos and deduplicating.
 */
export function sanitizeAircraftImages(
  images: { url: string; type?: string }[] | null | undefined
): { url: string; type: string }[] {
  if (!Array.isArray(images)) return [];
  const seen = new Set<string>();
  const result: { url: string; type: string }[] = [];

  for (const img of images) {
    if (!img?.url) continue;
    const type = (img.type || "exterior").toLowerCase();
    if (BLOCKED_IMAGE_TYPES.has(type) || seen.has(img.url)) continue;
    seen.add(img.url);
    result.push({ url: img.url, type });
  }

  return result;
}

/**
 * Check if a string looks like an aircraft registration / tail number.
 */
export function looksLikeRegistration(text: string | null | undefined): boolean {
  if (!text) return false;
  return /^[A-Z0-9]{1,4}-[A-Z0-9]{2,5}$/i.test(text.trim());
}
