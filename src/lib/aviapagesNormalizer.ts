/**
 * Centralized Aviapages API normalization layer.
 *
 * ALL raw API data must pass through these normalizers before reaching
 * any React component — public or internal.
 *
 * Responsibilities:
 *  1. Field normalization (snake_case, safe types, fallbacks)
 *  2. Image dedup + privacy filtering
 *  3. Airport/coordinate normalization
 *  4. Price normalization
 *  5. Deduplication by ID
 *
 * Public components then additionally pipe through sanitize.ts helpers.
 */

import { sanitizeAircraftName, sanitizeAircraftImages, sanitizeAircraftForPublic } from "./sanitize";
import type { PublicAircraft } from "./sanitize";
import { getAircraftImage, getAircraftCategory } from "./aircraftImages";

// ── Primitive helpers ───────────────────────────────────────────────────────

export function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function toStr(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

// ── Airport normalization ───────────────────────────────────────────────────

export interface NormalizedAirport {
  id: number;
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
}

export function normalizeAirport(raw: unknown): NormalizedAirport | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  return {
    id: typeof o.id === "number" ? o.id : 0,
    name: toStr(o.name),
    iata: toStr(o.iata),
    icao: toStr(o.icao),
    city: toStr(o.city),
    country: toStr(o.country),
    lat: toNum(o.lat ?? o.latitude),
    lng: toNum(o.lng ?? o.lon ?? o.longitude),
  };
}

// ── Image normalization ─────────────────────────────────────────────────────

const BLOCKED_IMAGE_TYPES = new Set(["tail", "registration"]);

/** Normalize any image array shape, dedup, and filter blocked types */
export function normalizeImages(raw: unknown): { url: string; type: string }[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: { url: string; type: string }[] = [];

  for (const img of raw) {
    if (!img || typeof img !== "object") continue;
    const imgObj = img as Record<string, unknown>;
    const media = imgObj.media as Record<string, unknown> | undefined;
    const url = String(imgObj.url || media?.path || "");
    const type = String(imgObj.type || imgObj.image_type || "exterior").toLowerCase();

    if (!url || BLOCKED_IMAGE_TYPES.has(type) || seen.has(url)) continue;
    seen.add(url);
    result.push({ url, type });
  }

  return result;
}

// ── Empty Leg normalization ─────────────────────────────────────────────────

export interface NormalizedEmptyLeg {
  id: number;
  aircraft_type: string;
  aircraft_class: string | null;
  aircraft_image: string | null;
  aircraft_images?: { url: string; type: string }[];
  aircraft_floor_plan: string | null;
  aircraft_max_pax: number | null;
  aircraft_range_km: number | null;
  company: string; // Always "" for B2C
  from_date: string;
  to_date: string;
  price: number | null;
  currency: string;
  comment: string;
  departure: NormalizedAirport | null;
  arrival: NormalizedAirport | null;
}

export function normalizeEmptyLeg(raw: unknown): NormalizedEmptyLeg | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const departure = normalizeAirport(o.departure);
  const arrival = normalizeAirport(o.arrival);
  const aircraftImages = sanitizeAircraftImages(normalizeImages(o.aircraft_images));

  const price = toNum(o.price) ?? toNum(o.price_total) ?? toNum(o.total_price) ?? null;

  return {
    id: typeof o.id === "number" ? o.id : 0,
    aircraft_type: sanitizeAircraftName(toStr(o.aircraft_type, "Unknown")),
    aircraft_class: typeof o.aircraft_class === "string" ? o.aircraft_class : null,
    aircraft_image: typeof o.aircraft_image === "string" && o.aircraft_image
      ? o.aircraft_image
      : (aircraftImages[0]?.url || null),
    aircraft_images: aircraftImages.length > 0 ? aircraftImages : undefined,
    aircraft_floor_plan: typeof o.aircraft_floor_plan === "string" ? o.aircraft_floor_plan : null,
    aircraft_max_pax: toNum(o.aircraft_max_pax),
    aircraft_range_km: toNum(o.aircraft_range_km),
    company: "", // Never expose operator to B2C
    from_date: toStr(o.from_date),
    to_date: toStr(o.to_date),
    price,
    currency: toStr(o.currency, "USD"),
    comment: toStr(o.comment),
    departure,
    arrival,
  };
}

// ── Charter Search Result normalization ─────────────────────────────────────

export interface NormalizedCharterResult {
  id: number;
  aircraft_type: string;
  aircraft_class: string | null;
  manufacturer: string | null;
  year_of_production: number | null;
  max_passengers: number | null;
  range_km: number | null;
  speed_kmh: number | null;
  cabin_height_m: number | null;
  cabin_width_m: number | null;
  cabin_length_m: number | null;
  luggage_volume_m3: number | null;
  sleeping_places: number | null;
  amenities: string[];
  price: number | null;
  price_currency: string;
  price_unit: string | null;
  estimated_flight_time_min: number | null;
  engine_type: string | null;
  engine_count: number | null;
  images: {
    exterior: string | null;
    cabin: string | null;
    floor_plan: string | null;
    all: { url: string; type: string }[];
  };
  certified: boolean;
}

/** Non-jet exclusion regex */
const NON_JET_RE = /turboprop|caravan|pc-12|tbm|king air|piper|cessna\s*(1[7-9]|2[0-9]|4[01])|beech(craft)?(?!\s*premier)|baron|bonanza|cirrus|pilatus|dornier|saab|dash|atr|emb-1[12]|robinson|r22|r44|r66|bell\s*\d|eurocopter|ec\s*1[345]|as\s*3[56]|agusta|aw\s*1[0-9]|guimbal|cabri|airbus\s*h1[2356]|sikorsky|s-76|md\s*[5-9]|hughes|propeller|helicopter|piston|cheyenne|navajo|seneca|aztec|seminole|chieftain/i;

export function normalizeCharterResult(raw: unknown): NormalizedCharterResult | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  // Sanitize through the unified helper
  const sanitized = sanitizeAircraftForPublic(o);

  const aircraftType = sanitized.name || sanitizeAircraftName(toStr(o.aircraft_type));
  const aircraftClass = toStr(o.aircraft_class || (o as any).class_name);

  // Filter non-jets
  if (NON_JET_RE.test(aircraftType) || NON_JET_RE.test(aircraftClass)) return null;
  const engineType = toStr((o as any).engine_type);
  if (/piston|turboprop|propeller/i.test(engineType)) return null;

  // Normalize images
  const imagesRaw = o.images as Record<string, unknown> | undefined;
  const allImages = sanitizeAircraftImages(
    normalizeImages(imagesRaw?.all || (o as any).aircraft_images)
  );

  return {
    id: typeof o.id === "number" ? o.id : 0,
    aircraft_type: aircraftType,
    aircraft_class: aircraftClass || null,
    manufacturer: toStr((o as any).manufacturer) || null,
    year_of_production: toNum((o as any).year_of_production),
    max_passengers: toNum((o as any).max_passengers ?? (o as any).max_pax),
    range_km: toNum((o as any).range_km),
    speed_kmh: toNum((o as any).speed_kmh),
    cabin_height_m: toNum((o as any).cabin_height_m),
    cabin_width_m: toNum((o as any).cabin_width_m),
    cabin_length_m: toNum((o as any).cabin_length_m),
    luggage_volume_m3: toNum((o as any).luggage_volume_m3),
    sleeping_places: toNum((o as any).sleeping_places),
    amenities: Array.isArray((o as any).amenities) ? (o as any).amenities : [],
    price: toNum((o as any).price),
    price_currency: toStr((o as any).price_currency, "USD"),
    price_unit: toStr((o as any).price_unit) || null,
    estimated_flight_time_min: toNum((o as any).estimated_flight_time_min),
    engine_type: engineType || null,
    engine_count: toNum((o as any).engine_count),
    images: {
      exterior: typeof imagesRaw?.exterior === "string" ? imagesRaw.exterior : (allImages[0]?.url || null),
      cabin: typeof imagesRaw?.cabin === "string" ? imagesRaw.cabin as string : null,
      floor_plan: typeof imagesRaw?.floor_plan === "string" ? imagesRaw.floor_plan as string : null,
      all: allImages,
    },
    certified: !!(o as any).operator?.certified || !!(sanitized as any).certified,
  };
}

// ── Fleet Aircraft normalization ────────────────────────────────────────────

export interface NormalizedFleetAircraft {
  id: number;
  name: string;
  slug: string;
  icao: string;
  class_name: string;
  class_id: number | null;
  manufacturer: string;
  range_km: number | null;
  max_pax: number | null;
  speed_kmh: number | null;
  altitude_m: number | null;
  cabin_height_m: number | null;
  cabin_length_m: number | null;
  cabin_width_m: number | null;
  luggage_volume_m3: number | null;
  engine_type: string | null;
  engine_count: number | null;
  image_url: string | null;
  floor_plan_url: string | null;
  images: { url: string; type: string; position: number }[];
  description: string | null;
  range_ferry_km: number | null;
  range_typical_km: number | null;
}

export function normalizeFleetAircraft(raw: unknown): NormalizedFleetAircraft {
  const o = raw as Record<string, unknown>;
  const sanitized = sanitizeAircraftForPublic(o);

  return {
    id: typeof o.id === "number" ? o.id : 0,
    name: sanitized.name || sanitizeAircraftName(toStr(o.name)),
    slug: toStr(o.slug),
    icao: toStr(o.icao),
    class_name: toStr(o.class_name),
    class_id: toNum(o.class_id),
    manufacturer: toStr(o.manufacturer),
    range_km: toNum(o.range_km),
    max_pax: toNum(o.max_pax),
    speed_kmh: toNum(o.speed_kmh),
    altitude_m: toNum(o.altitude_m),
    cabin_height_m: toNum(o.cabin_height_m),
    cabin_length_m: toNum(o.cabin_length_m),
    cabin_width_m: toNum(o.cabin_width_m),
    luggage_volume_m3: toNum(o.luggage_volume_m3),
    engine_type: toStr(o.engine_type) || null,
    engine_count: toNum(o.engine_count),
    image_url: toStr(o.image_url) || null,
    floor_plan_url: toStr(o.floor_plan_url) || null,
    images: sanitizeAircraftImages(normalizeImages(o.images)).map((img, i) => ({ ...img, position: i })),
    description: toStr(o.description) || null,
    range_ferry_km: toNum(o.range_ferry_km),
    range_typical_km: toNum(o.range_typical_km),
  };
}

// ── Deduplication ───────────────────────────────────────────────────────────

export function deduplicateById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// ── Public display mapper ───────────────────────────────────────────────────

export interface PublicDisplayAircraft {
  name: string;
  category: string;
  image: string;
  galleryImages: { url: string; type: string }[];
  floorPlanUrl: string | null;
  maxPax: number | null;
  rangeNm: number | null;
  speedKts: number | null;
  cabinLength: number | null;
  cabinWidth: number | null;
  cabinHeight: number | null;
  luggageM3: number | null;
  description: string | null;
}

/** Map any normalized aircraft to a safe public display shape */
export function toPublicDisplay(ac: {
  name?: string;
  aircraft_type?: string;
  class_name?: string;
  aircraft_class?: string;
  image_url?: string | null;
  images?: { url: string; type?: string }[];
  floor_plan_url?: string | null;
  max_pax?: number | null;
  max_passengers?: number | null;
  range_km?: number | null;
  speed_kmh?: number | null;
  cabin_length_m?: number | null;
  cabin_width_m?: number | null;
  cabin_height_m?: number | null;
  luggage_volume_m3?: number | null;
  description?: string | null;
}): PublicDisplayAircraft {
  const name = ac.name || ac.aircraft_type || "Private Jet";
  const category = ac.class_name || ac.aircraft_class || getAircraftCategory(name);
  const gallery = (ac.images || [])
    .filter(i => i.type !== "floor_plan" && i.type !== "floorplan" && i.type !== "layout")
    .map(i => ({ url: i.url, type: i.type || "exterior" }));
  // Never use image_url (API hero) — may show painted registrations; always use curated local
  const image = getAircraftImage(name);

  return {
    name,
    category,
    image,
    galleryImages: gallery.length > 0 ? gallery : [{ url: image, type: "exterior" }],
    floorPlanUrl: ac.floor_plan_url || null,
    maxPax: ac.max_pax ?? ac.max_passengers ?? null,
    rangeNm: ac.range_km ? Math.round(ac.range_km / 1.852) : null,
    speedKts: ac.speed_kmh ? Math.round(ac.speed_kmh / 1.852) : null,
    cabinLength: ac.cabin_length_m ?? null,
    cabinWidth: ac.cabin_width_m ?? null,
    cabinHeight: ac.cabin_height_m ?? null,
    luggageM3: ac.luggage_volume_m3 ?? null,
    description: ac.description ?? null,
  };
}
