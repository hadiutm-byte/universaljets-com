import { useQuery } from "@tanstack/react-query";

export interface EmptyLeg {
  id: number;
  aircraft_type: string;
  aircraft_class?: string | null;
  aircraft_image?: string | null;
  aircraft_images?: { url: string; type: string }[];
  aircraft_floor_plan?: string | null;
  aircraft_max_pax?: number | null;
  aircraft_range_km?: number | null;
  company: string;
  from_date: string;
  to_date: string;
  price: number | null;
  currency: string;
  comment: string;
  departure: {
    id: number;
    name: string;
    iata: string;
    icao: string;
    city: string;
    country: string;
    lat: number | null;
    lng: number | null;
  } | null;
  arrival: {
    id: number;
    name: string;
    iata: string;
    icao: string;
    city: string;
    country: string;
    lat: number | null;
    lng: number | null;
  } | null;
}

/** Safely coerce a value to number or null */
function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}

function toStr(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

/** Normalize a single airport-like object from the API into a safe shape */
function normalizeAirport(raw: unknown): EmptyLeg["departure"] {
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

/** Normalize a raw API empty-leg object into our known EmptyLeg shape */
export function normalizeEmptyLeg(raw: unknown): EmptyLeg | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const departure = normalizeAirport(o.departure);
  const arrival = normalizeAirport(o.arrival);

  return {
    id: typeof o.id === "number" ? o.id : Math.random(),
    aircraft_type: toStr(o.aircraft_type, "Unknown"),
    aircraft_class: typeof o.aircraft_class === "string" ? o.aircraft_class : null,
    aircraft_image: typeof o.aircraft_image === "string" ? o.aircraft_image : null,
    aircraft_max_pax: toNum(o.aircraft_max_pax),
    aircraft_range_km: toNum(o.aircraft_range_km),
    company: toStr(o.company),
    from_date: toStr(o.from_date),
    to_date: toStr(o.to_date),
    price: toNum(o.price),
    currency: toStr(o.currency, "USD"),
    comment: toStr(o.comment),
    departure,
    arrival,
  };
}

export interface Airport {
  id: number;
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
}

export interface AircraftType {
  id: number;
  name: string;
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
  description: string | null;
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useEmptyLegs(region: string = "All") {
  return useQuery({
    queryKey: ["empty-legs", region],
    queryFn: async () => {
      const params = new URLSearchParams({ region, limit: "50" });
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-empty-legs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch empty legs");
      }

      const raw = await response.json();
      const rawResults = Array.isArray(raw?.results) ? raw.results : [];
      const results = rawResults
        .map(normalizeEmptyLeg)
        .filter((l): l is EmptyLeg => l !== null);

      return { count: typeof raw?.count === "number" ? raw.count : results.length, results };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useAirportSearch(query: string) {
  return useQuery({
    queryKey: ["airports", query],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-airports?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search airports");
      }

      const result = await response.json();
      return result.results as Airport[];
    },
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAircraftTypes(search?: string, classId?: string) {
  return useQuery({
    queryKey: ["aircraft-types", search, classId],
    queryFn: async () => {
      const params = new URLSearchParams({ page_size: "50" });
      if (search) params.set("search", search);
      if (classId) params.set("class_id", classId);

      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-aircraft-types?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch aircraft types");
      }

      const result = await response.json();
      return result as { count: number; results: AircraftType[] };
    },
    staleTime: 30 * 60 * 1000,
  });
}
