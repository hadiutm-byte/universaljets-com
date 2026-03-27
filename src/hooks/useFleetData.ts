import { useQuery } from "@tanstack/react-query";
import { normalizeFleetAircraft, type NormalizedFleetAircraft } from "@/lib/aviapagesNormalizer";

export type FleetAircraft = NormalizedFleetAircraft;

/** Class IDs & keywords to exclude non-jet aircraft */
const EXCLUDED_CLASS_IDS = new Set([3, 4, 5, 9, 10, 11, 14]);
const EXCLUDED_RE = /turbo\s*prop|piston|propeller|helicopter|heli|rotary|turboshaft|airliner|king\s*air|pilatus|pc-?12|beech(?!jet)|tbm|dornier|atr|saab|dash|caravan|piaggio|cessna\s*4\d\d|cessna\s*1[7-9]\d|cessna\s*2[01]\d|piper|robinson|guimbal|bell\s*\d|sikorsky|eurocopter|airbus\s*heli|boeing\s*[237][0-9]{2}/i;

export function isJetAircraft(ac: FleetAircraft): boolean {
  if (ac.class_id != null && EXCLUDED_CLASS_IDS.has(ac.class_id)) return false;
  if (EXCLUDED_RE.test(ac.name)) return false;
  if (ac.class_name && EXCLUDED_RE.test(ac.class_name)) return false;
  if (ac.engine_type && /piston|turboprop|turboshaft/i.test(ac.engine_type)) return false;
  return true;
}

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useFleetAircraft(classId?: string) {
  return useQuery({
    queryKey: ["fleet-aircraft", classId || "all"],
    queryFn: async () => {
      const params = new URLSearchParams({ page_size: "200" });

      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-aircraft-types?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch fleet data");
      const result = await response.json();
      const all: FleetAircraft[] = (result.results || []).map(
        (ac: Record<string, unknown>) => normalizeFleetAircraft(ac)
      );
      return { count: result.count || 0, results: all.filter(isJetAircraft) };
    },
    staleTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000),
  });
}

export function useFleetAircraftBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["fleet-aircraft-detail", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const params = new URLSearchParams({ slug });
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/aviapages-aircraft-types?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getAnonKey()}`,
            apikey: getAnonKey(),
          },
        }
      );

      if (!response.ok) throw new Error("Aircraft not found");
      const data = await response.json();
      return normalizeFleetAircraft(data.result as Record<string, unknown>);
    },
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
}
