import { useQuery } from "@tanstack/react-query";
import {
  normalizeEmptyLeg,
  normalizeAirport,
  deduplicateById,
  type NormalizedEmptyLeg,
  type NormalizedAirport,
} from "@/lib/aviapagesNormalizer";
import { sanitizeAircraftName, sanitizeAircraftImages } from "@/lib/sanitize";

// ─── Re-export types for backward compatibility ─────────────────────────────

export type EmptyLeg = NormalizedEmptyLeg;
export type Airport = NormalizedAirport;

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

// ─── API helpers ────────────────────────────────────────────────────────────

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ─── Hooks ──────────────────────────────────────────────────────────────────

// ─── Client-side region filtering (avoids API rate limits) ──────────────────

const ICAO_REGION: Record<string, string[]> = {
  americas: ['K','C','M','T','S','P'],
  europe: ['EG','EI','LF','ED','LI','LE','LS','LO','EH','EB','LP','ES','EN','EK','EF','LK','EP','LG','LR','LH','LD','LC','LT','EL','LJ','LQ','LW','LY','LB','LZ','EY','EV','EE','BI','LM','EL','UU','UL'],
  middle_east: ['OM','OE','OT','OB','OO','OK','OJ','OL','LL','OR','OI','OY','UG','HE'],
  asia: ['WS','VH','RJ','RK','VI','VT','WM','WI','ZB','ZS','ZG','RP','RC','VV','VD','VG','YS','YM','YB','YP','NZ'],
  africa: ['FA','DN','HK','HE','GM','HT','DG','GO','FV','HA','HR','HC','FL','FW','FQ','FN','FZ','FB','FY'],
};

function icaoMatchesRegion(icao: string, region: string): boolean {
  const key = region.toLowerCase().replace(/\s+/g, '_');
  if (key === 'all' || !icao) return true;
  const prefixes = ICAO_REGION[key];
  if (!prefixes) return true;
  const upper = icao.toUpperCase();
  return prefixes.some(p => upper.startsWith(p));
}

function legMatchesRegion(leg: NormalizedEmptyLeg, region: string): boolean {
  if (!region || region === 'All') return true;
  const depIcao = leg.departure?.icao || '';
  const arrIcao = leg.arrival?.icao || '';
  return icaoMatchesRegion(depIcao, region) || icaoMatchesRegion(arrIcao, region);
}

export function useEmptyLegs(region: string = "All") {
  return useQuery({
    queryKey: ["empty-legs"],
    queryFn: async () => {
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-empty-legs?region=All`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch empty legs (${response.status})`);
      }

      const raw = await response.json();
      const rawResults = Array.isArray(raw?.results) ? raw.results : [];

      // Normalize → filter nulls → deduplicate
      const results = deduplicateById(
        rawResults
          .map(normalizeEmptyLeg)
          .filter((l): l is EmptyLeg => l !== null && l.id > 0)
      );

      return {
        count: typeof raw?.count === "number" ? raw.count : results.length,
        results,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (data): { count: number; results: EmptyLeg[] } => {
      if (!region || region === "All") return data;
      const filtered = data.results.filter(leg => legMatchesRegion(leg, region));
      return { count: filtered.length, results: filtered };
    },
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
      return (Array.isArray(result.results) ? result.results : []) as Airport[];
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
      // Sanitize names for public display
      const sanitized = ((result.results || []) as AircraftType[]).map(ac => ({
        ...ac,
        name: sanitizeAircraftName(ac.name),
      }));
      return { count: result.count || 0, results: sanitized };
    },
    staleTime: 30 * 60 * 1000,
  });
}
