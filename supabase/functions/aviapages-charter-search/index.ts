import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

/** Strip registration codes like "(HA-JEX)" or standalone "N123AB" from aircraft names */
function stripReg(name: string): string {
  return name
    .replace(/\s*\(([A-Z0-9]{1,5}-[A-Z0-9]{2,6}|N\d{1,5}[A-Z]{0,2})\)\s*/gi, ' ')
    .replace(/\b([A-Z0-9]{1,5}-[A-Z0-9]{2,6}|N\d{1,5}[A-Z]{0,2})\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Private Jet';
}

/** Coerce to finite number or null */
function toFiniteNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ─── Aircraft type cache for enrichment ──────────────────────────────────────
interface AircraftTypeMeta {
  class_name: string;
  class_id: number | null;
  max_pax: number | null;
  range_km: number | null;
  speed_kmh: number | null;
  cabin_height_m: number | null;
  cabin_width_m: number | null;
  cabin_length_m: number | null;
  luggage_volume_m3: number | null;
  engine_type: string | null;
  engine_count: number | null;
  manufacturer: string | null;
}

let aircraftTypeCache: Record<string, AircraftTypeMeta> = {};
let cacheLoaded = false;

async function loadAircraftTypeCache(apiKey: string) {
  if (cacheLoaded) return;
  try {
    for (let pg = 1; pg <= 2; pg++) {
      const response = await fetch(`${AVIAPAGES_BASE}/api/aircraft_types/?page_size=500&page=${pg}`, {
        headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
      });
      if (!response.ok) {
        if (response.status === 429) {
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        break;
      }
      const data = await response.json();
      const results = data.results || [];
      if (results.length === 0) break;

      for (const at of results) {
        const name = String(at.name || '').toLowerCase().trim();
        if (!name) continue;
        aircraftTypeCache[name] = {
          class_name: String(at.class_name || at.aircraft_class?.name || ''),
          class_id: toFiniteNum(at.aircraft_class?.id),
          max_pax: toFiniteNum(at.pax_maximum),
          range_km: toFiniteNum(at.range_maximum),
          speed_kmh: toFiniteNum(at.speed_typical),
          cabin_height_m: toFiniteNum(at.cabin_height),
          cabin_width_m: toFiniteNum(at.cabin_width),
          cabin_length_m: toFiniteNum(at.cabin_length),
          luggage_volume_m3: toFiniteNum(at.luggage_volume),
          engine_type: at.engine_type?.value || null,
          engine_count: toFiniteNum(at.engine_count),
          manufacturer: at.manufacturer_name || at.aircraft_type_global_family?.name || null,
        };
      }
      if (!data.next) break;
    }
    console.log(`[charter-search] Cached ${Object.keys(aircraftTypeCache).length} aircraft types`);
  } catch (e) {
    console.error('[charter-search] Failed to load aircraft type cache:', e);
  }
  cacheLoaded = true;
}

function lookupAircraftType(typeName: string): AircraftTypeMeta | null {
  const lower = typeName.toLowerCase().trim();
  if (aircraftTypeCache[lower]) return aircraftTypeCache[lower];
  for (const [key, val] of Object.entries(aircraftTypeCache)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

// ─── Hourly rate estimates by class (USD) ────────────────────────────────────
const CLASS_HOURLY_RATES: Record<string, { low: number; high: number }> = {
  "very light": { low: 2800, high: 4500 },
  "light": { low: 4000, high: 6500 },
  "midsize": { low: 5500, high: 8500 },
  "super midsize": { low: 7000, high: 11000 },
  "heavy": { low: 9000, high: 15000 },
  "ultra long range": { low: 11000, high: 18000 },
  "vip airliner": { low: 16000, high: 28000 },
};

const CLASS_SPEEDS: Record<string, number> = {
  "very light": 600, "light": 720, "midsize": 790,
  "super midsize": 830, "heavy": 870, "ultra long range": 900, "vip airliner": 850,
};

/** Estimate price from aircraft class and route distance */
function estimatePrice(
  classKey: string,
  depIcao: string, arrIcao: string,
  speedKmh: number | null
): { price: number | null; currency: string; unit: string } {
  const rates = CLASS_HOURLY_RATES[classKey];
  if (!rates) return { price: null, currency: 'USD', unit: 'estimate' };

  // Use great circle distance for estimation
  const depCoords = AIRPORT_COORDS[depIcao];
  const arrCoords = AIRPORT_COORDS[arrIcao];
  if (!depCoords || !arrCoords) return { price: null, currency: 'USD', unit: 'estimate' };

  const distNm = greatCircleNm(depCoords[0], depCoords[1], arrCoords[0], arrCoords[1]);
  const speed = speedKmh || CLASS_SPEEDS[classKey] || 790;
  const distKm = distNm * 1.852;
  const flightHours = Math.max(distKm / speed, 1);

  // Use low-end estimate as "from" price
  const lowEst = Math.round(rates.low * flightHours / 500) * 500;

  return { price: lowEst, currency: 'USD', unit: 'estimate' };
}

function greatCircleNm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ─── Compact airport coords ─────────────────────────────────────────────────
const AIRPORT_COORDS: Record<string, [number, number]> = {
  KJFK:[40.64,-73.78],KLGA:[40.77,-73.87],KEWR:[40.69,-74.17],KTEB:[40.85,-74.06],
  KLAX:[33.94,-118.41],KVNY:[34.21,-118.49],KSMO:[34.02,-118.45],
  KSFO:[37.62,-122.37],KOAK:[37.72,-122.22],KSJC:[37.36,-121.93],
  KMIA:[25.79,-80.29],KFLL:[26.07,-80.15],KPBI:[26.68,-80.10],
  KATL:[33.64,-84.43],KORD:[41.97,-87.90],KMDW:[41.79,-87.75],
  KDFW:[32.90,-97.04],KDAL:[32.85,-96.85],KHOU:[29.65,-95.28],KIAH:[29.98,-95.34],
  KDEN:[39.86,-104.67],KLAS:[36.08,-115.15],KPHX:[33.43,-112.01],
  KBOS:[42.36,-71.01],KSEA:[47.45,-122.31],KPHL:[39.87,-75.24],
  KDCA:[38.85,-77.04],KIAD:[38.94,-77.46],KMSP:[44.88,-93.22],
  KSAN:[32.73,-117.19],KAUS:[30.19,-97.67],KBNA:[36.12,-86.68],
  EGLL:[51.47,-0.46],EGLF:[51.28,-0.78],EGKB:[51.33,0.03],EGGW:[51.87,-0.37],
  EGSS:[51.89,0.24],EGKK:[51.15,-0.18],EGTK:[51.84,-1.32],EGCC:[53.35,-2.27],
  LFPB:[48.97,2.44],LFPO:[48.73,2.38],LFPG:[49.01,2.55],LFMD:[43.55,6.95],
  LFMN:[43.66,7.22],LFML:[43.44,5.22],
  EDDB:[52.36,13.50],EDDM:[48.35,11.79],EDDF:[50.03,8.57],EDDL:[51.29,6.77],
  LSZH:[47.46,8.55],LSGG:[46.24,6.11],LSZA:[46.00,8.91],
  LIRF:[41.80,12.25],LIML:[45.45,9.28],LIMC:[45.63,8.72],
  LEMD:[40.47,-3.56],LEBL:[41.30,2.08],LEPA:[39.55,2.74],
  LPPT:[38.77,-9.13],EHAM:[52.31,4.76],EBBR:[50.90,4.48],
  LOWW:[48.11,16.57],ENGM:[60.19,11.10],ESSA:[59.65,17.92],EKCH:[55.62,12.66],
  EIDW:[53.42,-6.27],LKPR:[50.10,14.26],EPWA:[52.17,20.97],LHBP:[47.44,19.26],
  LGAV:[37.94,23.94],LTFM:[41.28,28.73],LTAI:[36.90,30.80],LTBA:[40.98,28.82],
  OMDW:[24.89,55.17],OMDB:[25.25,55.36],OMAA:[24.44,54.65],OMSJ:[25.33,55.52],
  OTHH:[25.26,51.56],OERK:[24.96,46.70],OEJN:[21.68,39.17],
  OBBI:[26.27,50.63],OKBK:[29.23,47.97],OOMS:[23.59,58.28],
  LLBG:[32.01,34.88],HECA:[30.12,31.41],
  FAOR:[-26.14,28.25],FACT:[-33.96,18.60],HKJK:[-1.32,36.93],
  VIDP:[28.57,77.10],VABB:[19.09,72.87],WSSS:[1.36,103.99],WMKK:[2.75,101.71],
  VTBS:[13.68,100.75],VHHH:[22.31,113.91],RJTT:[35.55,139.78],RKSI:[37.46,126.44],
  ZBAA:[40.08,116.58],ZSPD:[31.14,121.81],RCTP:[25.08,121.23],
  YSSY:[-33.95,151.18],YMML:[-37.67,144.84],NZAA:[-37.01,174.79],
  CYYZ:[43.68,-79.63],CYUL:[45.47,-73.74],CYVR:[49.19,-123.18],
  MMMX:[19.44,-99.07],MMUN:[21.04,-86.87],SBGR:[-23.43,-46.47],
  SCEL:[-33.39,-70.79],SKBO:[4.70,-74.15],SAEZ:[-34.82,-58.54],
  UUEE:[55.97,37.41],UUDD:[55.41,37.91],
  LIRN:[40.88,14.29],LIPZ:[45.51,12.35],LIPE:[44.54,11.29],
  LEMG:[36.67,-4.50],LEAL:[38.28,-0.56],LEZL:[37.42,-5.89],
  LPFR:[37.01,-7.97],EFHK:[60.32,24.96],LCLK:[34.88,33.62],LCPH:[34.72,32.49],
  LOWI:[47.26,11.34],LOWS:[47.79,13.00],GMMN:[33.37,-7.59],
  TNCM:[18.04,-63.11],MYNN:[25.04,-77.47],TJSJ:[18.44,-66.00],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('AVIAPAGES_API_KEY');
    if (!apiKey) {
      throw new Error('AVIAPAGES_API_KEY not configured');
    }

    // Load aircraft type cache for enrichment
    await loadAircraftTypeCache(apiKey);

    const body = await req.json();
    const { from_icao, to_icao, date, passengers } = body;

    if (!from_icao || !to_icao) {
      return new Response(JSON.stringify({ error: 'from_icao and to_icao are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchBody: Record<string, unknown> = {
      dep_airport: { icao: from_icao },
      arr_airport: { icao: to_icao },
    };

    if (date) searchBody.date = date;
    if (passengers) searchBody.pax = parseInt(passengers, 10);

    console.log(`[charter-search] Searching ${from_icao} → ${to_icao}, pax=${passengers || 'any'}`);

    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(
        `${AVIAPAGES_BASE}/api/charter_searches/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchBody),
        }
      );
      if (response.status === 429) {
        const wait = Math.pow(2, attempt) * 2;
        console.log(`[charter-search] Rate limited, retrying in ${wait}s (attempt ${attempt + 1}/3)`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'No response';
      console.error(`[charter-search] API error [${response?.status}]: ${errorText}`);
      return new Response(JSON.stringify({ results: [], error: `API error ${response?.status}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`[charter-search] Got ${data.companies?.length || 0} companies`);

    const companies = data.companies || [];
    
    // Flatten into individual aircraft offers, enriched with type cache data
    const results = [];
    for (const company of companies) {
      for (const aircraft of (company.aircraft || [])) {
        const acTypeName = stripReg(aircraft.ac_type || aircraft.aircraft_type || 'Private Jet');

        // Enrich from aircraft type cache
        const typeData = lookupAircraftType(acTypeName);

        // ── Images: collect all, filter out any with tail numbers ──
        const allImages: { url: string; type: string; position: number }[] = [];
        let floorPlanUrl: string | null = null;

        for (const img of (aircraft.images || [])) {
          const imgType = (img.image_type || img.type || '').toLowerCase();
          if (imgType === 'tail' || imgType === 'registration') continue;
          
          const imgUrl = img.url || (img.media && typeof img.media === 'object' ? img.media.path : null);
          if (imgUrl) {
            allImages.push({ url: imgUrl, type: imgType || 'exterior', position: img.position ?? 0 });
          }
          if (imgType === 'floor_plan' || imgType === 'floorplan' || imgType === 'layout') {
            floorPlanUrl = imgUrl || null;
          }
        }

        const hasNotail = allImages.some(i => i.type === 'notail');
        const filteredImages = hasNotail ? allImages.filter(i => i.type !== 'exterior') : allImages;

        const notailImage = filteredImages.find(i => i.type === 'notail')?.url || null;
        const exteriorImage = filteredImages.find(i => i.type === 'exterior')?.url || null;
        const cabinImage = filteredImages.find(i => i.type === 'cabin')?.url || null;

        // ── Enrich specs from type cache ──
        const aircraftClass = aircraft.aircraft_class?.name || aircraft.class_name || typeData?.class_name || null;
        const maxPax = aircraft.max_passengers || aircraft.pax_maximum || typeData?.max_pax || null;
        const rangeKm = aircraft.range || aircraft.range_maximum || typeData?.range_km || null;
        const speedKmh = aircraft.speed || aircraft.cruise_speed || typeData?.speed_kmh || null;
        const cabinHeight = aircraft.cabin_height ?? aircraft.cabin_height_m ?? typeData?.cabin_height_m ?? null;
        const cabinWidth = aircraft.cabin_width ?? aircraft.cabin_width_m ?? typeData?.cabin_width_m ?? null;
        const cabinLength = aircraft.cabin_length ?? aircraft.cabin_length_m ?? typeData?.cabin_length_m ?? null;
        const luggageVolume = aircraft.luggage_volume ?? aircraft.luggage_volume_m3 ?? typeData?.luggage_volume_m3 ?? null;
        const engineType = aircraft.engine_type || typeData?.engine_type || null;
        const engineCount = aircraft.engine_count || typeData?.engine_count || null;
        const manufacturer = aircraft.manufacturer?.name || aircraft.manufacturer || typeData?.manufacturer || null;

        // ── Amenities / features ──
        const amenities: string[] = [];
        if (aircraft.wifi || aircraft.has_wifi) amenities.push('Wi-Fi');
        if (aircraft.lavatory || aircraft.has_lavatory) amenities.push('Lavatory');
        if (aircraft.galley || aircraft.has_galley) amenities.push('Galley');
        if (aircraft.shower || aircraft.has_shower) amenities.push('Shower');
        if (aircraft.entertainment || aircraft.has_entertainment) amenities.push('Entertainment');
        if (aircraft.satellite_phone || aircraft.has_satphone) amenities.push('Satellite Phone');
        if (aircraft.bed || aircraft.has_bed || aircraft.sleeping_places) amenities.push('Sleeping');
        if (aircraft.baggage_compartment) amenities.push('Baggage Hold');

        // ── Pricing — estimate from class + route distance ──
        const rawPrice =
          toFiniteNum(aircraft.price) ??
          toFiniteNum(aircraft.charter_price) ??
          toFiniteNum(aircraft.price_total) ??
          toFiniteNum(aircraft.total_price) ??
          toFiniteNum(aircraft.amount) ??
          null;

        const rawCurrency =
          aircraft.currency_code || aircraft.currency ||
          aircraft.price_currency || company.currency || 'USD';

        const rawPriceUnit = aircraft.price_unit || aircraft.pricing_type || null;

        // If no API price, generate server-side estimate from class + route
        let finalPrice = rawPrice;
        let finalCurrency = rawCurrency;
        let finalPriceUnit = rawPriceUnit;

        if (finalPrice == null && aircraftClass) {
          const classKey = aircraftClass.toLowerCase().replace(/\s*jet$/i, '').trim();
          const est = estimatePrice(classKey, from_icao, to_icao, speedKmh);
          if (est.price) {
            finalPrice = est.price;
            finalCurrency = est.currency;
            finalPriceUnit = 'estimate';
          }
        }

        const flightTime = toFiniteNum(aircraft.flight_time) ?? toFiniteNum(aircraft.estimated_flight_time) ?? null;

        results.push({
          id: aircraft.id,
          aircraft_type: acTypeName,
          year_of_production: aircraft.year_of_production || aircraft.yom || null,
          max_passengers: maxPax,
          range_km: rangeKm,
          speed_kmh: speedKmh,
          cabin_height_m: cabinHeight,
          cabin_width_m: cabinWidth,
          cabin_length_m: cabinLength,
          luggage_volume_m3: luggageVolume,
          sleeping_places: aircraft.sleeping_places || null,
          amenities,
          price: finalPrice,
          price_currency: finalCurrency,
          price_unit: finalPriceUnit,
          estimated_flight_time_min: flightTime,
          images: {
            exterior: notailImage || exteriorImage,
            cabin: cabinImage,
            floor_plan: floorPlanUrl,
            all: filteredImages,
          },
          operator: {
            id: 0, name: '', city: '', country: '', logo_url: null,
            certified: company.aviapages_certified || false,
            avg_response_time: null, avg_response_rate: null,
          },
          aircraft_class: aircraftClass,
          manufacturer,
          engine_type: engineType,
          engine_count: engineCount,
        });
      }
    }

    console.log(`[charter-search] Returning ${results.length} aircraft options (${results.filter(r => r.price).length} with prices)`);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Charter search error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message, results: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});