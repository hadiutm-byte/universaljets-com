import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export function useEmptyLegs(region: string = "All") {
  return useQuery({
    queryKey: ["empty-legs", region],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("aviapages-empty-legs", {
        body: null,
        method: "GET",
        headers: {},
      });

      // supabase.functions.invoke uses POST, so we pass params via the URL workaround
      // Instead, let's use fetch directly with the project URL
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const params = new URLSearchParams({ region, limit: "20" });
      const response = await fetch(
        `${supabaseUrl}/functions/v1/aviapages-empty-legs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch empty legs");
      }

      const result = await response.json();
      return result as { count: number; results: EmptyLeg[] };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAirportSearch(query: string) {
  return useQuery({
    queryKey: ["airports", query],
    queryFn: async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const params = new URLSearchParams({ q: query });
      const response = await fetch(
        `${supabaseUrl}/functions/v1/aviapages-airports?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
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
