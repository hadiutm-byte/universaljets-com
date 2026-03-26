import { useQuery } from "@tanstack/react-query";

export interface ApiAirport {
  id: number;
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
}

export interface ApiFbo {
  id: number;
  name: string;
  airport_name: string;
  airport_icao: string;
  airport_iata: string;
  city: string;
  country: string;
  services: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  vip_lounge: boolean;
  customs: boolean;
  hangar: boolean;
  fuel: string | null;
}

async function fetchAirportsForCity(cityName: string): Promise<ApiAirport[]> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aviapages-airports?q=${encodeURIComponent(cityName)}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );

  if (!response.ok) return [];
  const json = await response.json();
  return json.results || [];
}

async function fetchFbosForAirport(icao: string): Promise<ApiFbo[]> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aviapages-fbos?airport=${encodeURIComponent(icao)}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    }
  );

  if (!response.ok) return [];
  const json = await response.json();
  return json.results || [];
}

export interface DestinationApiData {
  airports: ApiAirport[];
  fbos: ApiFbo[];
}

export function useDestinationAirports(cityName: string) {
  return useQuery<ApiAirport[]>({
    queryKey: ["destination-airports", cityName],
    queryFn: () => fetchAirportsForCity(cityName),
    staleTime: 1000 * 60 * 30, // 30 min
    enabled: !!cityName,
  });
}

export function useDestinationFbos(icaoCodes: string[]) {
  return useQuery<ApiFbo[]>({
    queryKey: ["destination-fbos", icaoCodes.join(",")],
    queryFn: async () => {
      if (!icaoCodes.length) return [];
      const allFbos = await Promise.all(icaoCodes.map(fetchFbosForAirport));
      return allFbos.flat();
    },
    staleTime: 1000 * 60 * 30,
    enabled: icaoCodes.length > 0,
  });
}
