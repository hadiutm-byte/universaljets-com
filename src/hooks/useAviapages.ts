import { useQuery } from "@tanstack/react-query";

export interface EmptyLeg {
  id: number;
  aircraft_type: string;
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

export interface Airport {
  id: number;
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
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

      return (await response.json()) as { count: number; results: EmptyLeg[] };
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
