import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

// Cache aircraft type lookups in memory (refreshed per cold start)
let aircraftTypeCache: Record<string, { image_url: string | null; class_name: string; max_pax: number | null; range_km: number | null }> = {};
let cacheLoaded = false;

// Cache airport coordinates for coordinate enrichment
let airportCoordCache: Record<string, { lat: number; lng: number }> = {};
let airportCacheLoaded = false;

async function loadAircraftTypeCache(apiKey: string) {
  if (cacheLoaded) return;
  try {
    const response = await fetch(`${AVIAPAGES_BASE}/api/aircraft_types/?page_size=500`, {
      headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      for (const at of (data.results || [])) {
        const name = (at.name || '').toLowerCase();
        aircraftTypeCache[name] = {
          image_url: at.images?.[0]?.media?.path || null,
          class_name: at.class_name || at.aircraft_class?.name || '',
          max_pax: at.pax_maximum || null,
          range_km: at.range_maximum || null,
        };
      }
      console.log(`[empty-legs] Cached ${Object.keys(aircraftTypeCache).length} aircraft types`);
    }
  } catch (e) {
    console.error('[empty-legs] Failed to load aircraft type cache:', e);
  }
  cacheLoaded = true;
}

async function loadAirportCoordCache(apiKey: string) {
  if (airportCacheLoaded) return;
  try {
    // Fetch a large set of airports with coordinates
    const response = await fetch(`${AVIAPAGES_BASE}/api/airports/?page_size=500`, {
      headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      for (const ap of (data.results || [])) {
        const icao = ap.icao;
        const lat = ap.latitude ?? ap.lat;
        const lng = ap.longitude ?? ap.lng ?? ap.lon;
        if (icao && lat != null && lng != null) {
          airportCoordCache[icao] = { lat: Number(lat), lng: Number(lng) };
        }
      }
      console.log(`[empty-legs] Cached ${Object.keys(airportCoordCache).length} airport coordinates`);
    }
  } catch (e) {
    console.error('[empty-legs] Failed to load airport coord cache:', e);
  }
  airportCacheLoaded = true;
}

function lookupAircraftType(typeName: string) {
  const lower = typeName.toLowerCase();
  if (aircraftTypeCache[lower]) return aircraftTypeCache[lower];
  for (const [key, val] of Object.entries(aircraftTypeCache)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

function enrichAirportCoords(airport: any): any {
  if (!airport) return airport;
  const lat = airport.lat ?? airport.latitude;
  const lng = airport.lng ?? airport.longitude ?? airport.lon;
  if (lat != null && lng != null) return { ...airport, lat, lng };
  // Lookup from cached airport coords
  const icao = airport.icao;
  if (icao && airportCoordCache[icao]) {
    return { ...airport, lat: airportCoordCache[icao].lat, lng: airportCoordCache[icao].lng };
  }
  return airport;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('AVIAPAGES_API_KEY');
    if (!apiKey) {
      throw new Error('AVIAPAGES_API_KEY not configured');
    }

    // Load both caches in parallel
    await Promise.all([
      loadAircraftTypeCache(apiKey),
      loadAirportCoordCache(apiKey),
    ]);

    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const region = url.searchParams.get('region') || '';

    const params = new URLSearchParams({ page, page_size: limit });

    if (region && region !== 'All') {
      const regionCountries: Record<string, string> = {
        'Europe': 'GB,FR,DE,IT,ES,CH,AT,NL,BE,PT,SE,NO,DK,FI,IE,CZ,PL,GR,RO,HU',
        'Americas': 'US,CA,MX,BR,AR,CO,CL',
        'Middle East': 'AE,SA,QA,BH,OM,KW,JO,LB',
        'Asia': 'SG,HK,JP,KR,IN,TH,MY,ID,CN,PH',
        'Africa': 'ZA,NG,KE,EG,MA,TZ,GH',
      };
      if (regionCountries[region]) {
        params.set('dep_airport_country_iso_in', regionCountries[region]);
      }
    }

    const apiUrl = `${AVIAPAGES_BASE}/api/availabilities/?${params.toString()}`;
    console.log(`[empty-legs] Requesting: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
    });

    const responseText = await response.text();
    console.log(`[empty-legs] Status: ${response.status}`);

    if (!response.ok) {
      console.error(`[empty-legs] API error [${response.status}]: ${responseText.substring(0, 200)}`);
      return new Response(JSON.stringify({ count: 0, results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);

    const normalized = {
      count: data.count || 0,
      results: (data.results || []).map((leg: any) => {
        const aircraftType = leg.aircraft_type || 'Private Jet';
        const typeData = lookupAircraftType(aircraftType);

        const depRaw = leg.dep_airport ? {
          id: leg.dep_airport.id || 0,
          name: leg.dep_airport.name || '',
          iata: leg.dep_airport.iata || '',
          icao: leg.dep_airport.icao || '',
          city: leg.dep_airport.city?.name || leg.dep_airport.city || '',
          country: leg.dep_airport.city?.country?.name || leg.dep_airport.country || '',
          lat: leg.dep_airport.latitude ?? leg.dep_airport.lat ?? null,
          lng: leg.dep_airport.longitude ?? leg.dep_airport.lng ?? null,
        } : null;

        const arrRaw = leg.arr_airport ? {
          id: leg.arr_airport.id || 0,
          name: leg.arr_airport.name || '',
          iata: leg.arr_airport.iata || '',
          icao: leg.arr_airport.icao || '',
          city: leg.arr_airport.city?.name || leg.arr_airport.city || '',
          country: leg.arr_airport.city?.country?.name || leg.arr_airport.country || '',
          lat: leg.arr_airport.latitude ?? leg.arr_airport.lat ?? null,
          lng: leg.arr_airport.longitude ?? leg.arr_airport.lng ?? null,
        } : null;

        return {
          id: leg.id || leg.availability_id || Math.random(),
          aircraft_type: aircraftType,
          aircraft_class: typeData?.class_name || null,
          aircraft_image: typeData?.image_url || null,
          aircraft_max_pax: typeData?.max_pax || null,
          aircraft_range_km: typeData?.range_km || null,
          company: leg.company || leg.operator?.name || '',
          from_date: leg.from_date || leg.from_date_utc || '',
          to_date: leg.to_date || leg.to_date_utc || '',
          price: leg.price ?? null,
          currency: leg.currency_code || leg.currency || 'USD',
          comment: leg.comment || '',
          departure: enrichAirportCoords(depRaw),
          arrival: enrichAirportCoords(arrRaw),
        };
      }),
    };

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[empty-legs] Error:', error);
    return new Response(JSON.stringify({ count: 0, results: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
