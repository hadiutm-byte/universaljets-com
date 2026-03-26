import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

// Cache aircraft type lookups in memory (refreshed per cold start)
let aircraftTypeCache: Record<string, {
  image_url: string | null;
  all_images: { url: string; type: string }[];
  floor_plan_url: string | null;
  class_name: string;
  max_pax: number | null;
  range_km: number | null;
}> = {};
let cacheLoaded = false;

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
        const images = (at.images || []);
        const allImages: { url: string; type: string }[] = [];
        let floorPlanUrl: string | null = null;

        for (const img of images) {
          const url = img.media?.path || img.url || null;
          const imgType = (img.image_type || img.type || 'exterior').toLowerCase();
          // Skip images that might expose tail numbers / registration
          if (imgType === 'tail' || imgType === 'registration') continue;
          if (url) {
            allImages.push({ url, type: imgType });
            if (imgType === 'floor_plan' || imgType === 'floorplan' || imgType === 'layout') {
              floorPlanUrl = url;
            }
          }
        }

        aircraftTypeCache[name] = {
          image_url: allImages[0]?.url || null,
          all_images: allImages,
          floor_plan_url: floorPlanUrl,
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

function lookupAircraftType(typeName: string) {
  const lower = typeName.toLowerCase();
  if (aircraftTypeCache[lower]) return aircraftTypeCache[lower];
  for (const [key, val] of Object.entries(aircraftTypeCache)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

/** Comprehensive ICAO → [lat, lng] lookup */
const AIRPORT_COORDS: Record<string, [number, number]> = {
  KJFK:[40.64,-73.78],KLGA:[40.77,-73.87],KEWR:[40.69,-74.17],KTEB:[40.85,-74.06],
  KFRG:[40.73,-73.41],KHPN:[41.07,-73.71],KCDW:[40.88,-74.28],KMMU:[40.80,-74.42],
  KLAX:[33.94,-118.41],KVNY:[34.21,-118.49],KSMO:[34.02,-118.45],KBUR:[34.20,-118.36],
  KSNA:[33.68,-117.87],KCRQ:[33.13,-117.28],KPSP:[33.83,-116.51],KSBD:[34.10,-117.24],
  KSFO:[37.62,-122.37],KOAK:[37.72,-122.22],KSJC:[37.36,-121.93],KCCR:[37.99,-122.06],
  KMIA:[25.79,-80.29],KOPF:[25.91,-80.28],KFLL:[26.07,-80.15],KFXE:[26.20,-80.17],
  KPBI:[26.68,-80.10],KBCT:[26.38,-80.11],KFPR:[27.50,-80.37],KORL:[28.55,-81.33],
  KTPA:[27.98,-82.53],KRSW:[26.54,-81.76],KAPF:[26.15,-81.78],KSRQ:[27.40,-82.55],
  KATL:[33.64,-84.43],KPDK:[33.88,-84.30],KFTY:[33.78,-84.52],
  KORD:[41.97,-87.90],KMDW:[41.79,-87.75],KPWK:[42.11,-87.90],KDPA:[41.91,-88.25],
  KDFW:[32.90,-97.04],KDAL:[32.85,-96.85],KADS:[32.97,-96.84],KFTW:[32.82,-97.36],
  KHOU:[29.65,-95.28],KIAH:[29.98,-95.34],KSGR:[29.62,-95.66],KELP:[31.81,-106.38],
  KAUS:[30.19,-97.67],KSAT:[29.53,-98.47],KCVB:[29.34,-98.85],
  KDEN:[39.86,-104.67],KAPA:[39.57,-104.85],KBJC:[39.91,-105.12],KCOS:[38.81,-104.70],
  KLAS:[36.08,-115.15],KVGT:[36.21,-115.19],KHND:[35.97,-115.13],
  KPHX:[33.43,-112.01],KSDL:[33.62,-111.91],KFFZ:[33.46,-111.73],KTUS:[32.12,-110.94],
  KBOS:[42.36,-71.01],KBED:[42.47,-71.29],KBVY:[42.58,-70.92],
  KSEA:[47.45,-122.31],KBFI:[47.53,-122.30],KPAE:[47.91,-122.28],
  KPHL:[39.87,-75.24],KPNE:[40.08,-75.01],KILG:[39.68,-75.61],
  KDCA:[38.85,-77.04],KIAD:[38.94,-77.46],KBWI:[39.18,-76.67],
  KMSP:[44.88,-93.22],KANE:[45.15,-93.21],KFCM:[44.83,-93.46],
  KSTL:[38.75,-90.37],KSUS:[38.66,-90.65],KMCI:[39.30,-94.71],
  KCLT:[35.21,-80.94],KRDU:[35.88,-78.79],KGSO:[36.10,-79.94],
  KCLE:[41.41,-81.85],KCGF:[41.57,-81.49],KPIT:[40.49,-80.23],
  KIND:[39.72,-86.29],KEYE:[39.83,-86.30],KBNA:[36.12,-86.68],
  KPDX:[45.59,-122.60],KHIO:[45.54,-122.95],
  KSLC:[40.79,-111.98],KRVS:[36.04,-95.98],KTUL:[36.20,-95.89],
  KSMF:[38.70,-121.59],KSAN:[32.73,-117.19],KRNM:[33.04,-116.92],
  KOMA:[41.30,-95.89],KLNK:[40.85,-96.76],KPTK:[42.67,-83.42],KDTW:[42.21,-83.35],
  KMEM:[35.04,-89.98],KNEW:[30.04,-90.03],KMSY:[29.99,-90.26],
  KJAX:[30.49,-81.69],KCHS:[32.90,-80.04],KSAV:[32.13,-81.20],
  KABQ:[35.04,-106.61],KANC:[61.17,-149.99],PHNL:[21.32,-157.92],
  CYYZ:[43.68,-79.63],CYUL:[45.47,-73.74],CYVR:[49.19,-123.18],CYYC:[51.11,-114.02],
  CYEG:[53.31,-113.58],CYOW:[45.32,-75.67],CYHZ:[44.88,-63.51],CYQB:[46.79,-71.39],
  CYWG:[49.91,-97.24],CYLW:[49.96,-119.38],CYKF:[43.46,-80.38],CYXU:[43.03,-81.15],CYTZ:[43.63,-79.40],
  MMMX:[19.44,-99.07],MMUN:[21.04,-86.87],MMSD:[22.95,-109.95],MMGL:[20.52,-103.31],
  MMMY:[25.78,-100.11],MMPR:[20.68,-105.25],
  TNCM:[18.04,-63.11],MYNN:[25.04,-77.47],TJSJ:[18.44,-66.00],MKJS:[18.50,-77.91],
  TIST:[18.34,-64.97],TLPL:[14.02,-60.95],TBPB:[13.07,-59.49],
  MPTO:[9.07,-79.38],MROC:[10.00,-84.21],MGGT:[14.58,-90.53],
  SBGR:[-23.43,-46.47],SBRJ:[-22.91,-43.16],SBSP:[-23.63,-46.66],SBCF:[-19.62,-43.97],
  SCEL:[-33.39,-70.79],SKBO:[4.70,-74.15],SAEZ:[-34.82,-58.54],SABE:[-34.56,-58.42],
  SEQM:[-0.13,-78.49],SPJC:[-12.02,-77.11],SVMI:[10.60,-66.99],
  EGLL:[51.47,-0.46],EGLF:[51.28,-0.78],EGKB:[51.33,0.03],EGGW:[51.87,-0.37],
  EGSS:[51.89,0.24],EGKK:[51.15,-0.18],EGLC:[51.51,0.05],EGHI:[50.95,-1.36],
  EGTK:[51.84,-1.32],EGCC:[53.35,-2.27],EGNX:[52.83,-1.33],EGPF:[55.87,-4.43],
  EGPH:[55.95,-3.37],EGBB:[52.45,-1.75],
  LFPB:[48.97,2.44],LFPO:[48.73,2.38],LFPG:[49.01,2.55],LFMD:[43.55,6.95],
  LFMN:[43.66,7.22],LFML:[43.44,5.22],LFLL:[45.73,5.08],LFBD:[44.83,-0.72],
  LFRS:[47.15,-1.61],LFSB:[47.59,7.53],LFMT:[43.58,3.96],
  EDDB:[52.36,13.50],EDDM:[48.35,11.79],EDDF:[50.03,8.57],EDDL:[51.29,6.77],
  EDDH:[53.63,9.99],EDDS:[48.69,9.22],EDDC:[51.13,13.77],EDDN:[49.50,11.07],
  EDDV:[52.46,9.68],EDDK:[50.87,7.14],
  LSZH:[47.46,8.55],LSGG:[46.24,6.11],LSZA:[46.00,8.91],LSZB:[46.91,7.50],LSZR:[47.49,9.56],
  LIRF:[41.80,12.25],LIRA:[41.80,12.59],LIML:[45.45,9.28],LIMC:[45.63,8.72],
  LIMF:[45.20,7.65],LIPZ:[45.51,12.35],LIRN:[40.88,14.29],LIPE:[44.54,11.29],
  LICJ:[38.18,13.09],LIEO:[40.90,9.52],LIRS:[42.76,11.07],
  LEMD:[40.47,-3.56],LEBL:[41.30,2.08],LEPA:[39.55,2.74],LEMG:[36.67,-4.50],
  LEAL:[38.28,-0.56],LEZL:[37.42,-5.89],LEVC:[39.49,-0.47],LEGE:[41.90,2.76],
  GCFV:[28.45,-13.86],GCLP:[27.93,-15.39],GCLA:[28.63,-17.76],GCTS:[28.04,-16.57],
  LEST:[42.90,-8.42],LEBB:[43.30,-2.91],
  LPPT:[38.77,-9.13],LPFR:[37.01,-7.97],LPPR:[41.24,-8.68],LPMA:[32.69,-16.77],
  EHAM:[52.31,4.76],EHRD:[51.96,4.44],EHEH:[51.45,5.37],
  EBBR:[50.90,4.48],EBAW:[51.19,4.46],EBLG:[50.64,5.44],
  LOWW:[48.11,16.57],LOWG:[46.99,15.44],LOWI:[47.26,11.34],LOWS:[47.79,13.00],
  ENGM:[60.19,11.10],ENBR:[60.29,5.22],ESSA:[59.65,17.92],ESGG:[57.66,12.28],
  EKCH:[55.62,12.66],EFHK:[60.32,24.96],BIKF:[63.99,-22.61],
  EIDW:[53.42,-6.27],EINN:[52.70,-8.92],EICK:[51.84,-8.49],
  LKPR:[50.10,14.26],LKKB:[50.12,14.54],EPMO:[52.45,20.65],EPWA:[52.17,20.97],
  EPKK:[50.08,19.79],LHBP:[47.44,19.26],LROP:[44.57,26.08],
  LGAV:[37.94,23.94],LGSK:[37.18,25.52],LGMK:[37.44,25.35],LGKR:[39.60,19.91],
  LTFM:[41.28,28.73],LTAI:[36.90,30.80],LTBA:[40.98,28.82],LTFJ:[40.74,30.08],
  LCLK:[34.88,33.62],LCPH:[34.72,32.49],
  OMDW:[24.89,55.17],OMDB:[25.25,55.36],OMAA:[24.44,54.65],OMSJ:[25.33,55.52],
  OTHH:[25.26,51.56],OERK:[24.96,46.70],OEJN:[21.68,39.17],OEDF:[26.47,49.80],
  OBBI:[26.27,50.63],OKBK:[29.23,47.97],OOMS:[23.59,58.28],
  LLBG:[32.01,34.88],OJAI:[31.72,35.99],OLBA:[33.82,35.49],
  HECA:[30.12,31.41],HEGN:[27.18,33.80],GMMN:[33.37,-7.59],GMME:[34.05,-6.75],GMTT:[35.73,-5.32],
  FAOR:[-26.14,28.25],FACT:[-33.96,18.60],FALE:[-29.61,31.12],
  HKJK:[-1.32,36.93],HTDA:[-6.88,39.20],FVHA:[-17.93,31.09],
  DNMM:[6.58,3.32],DGAA:[5.61,-0.17],GOBD:[14.74,-17.49],
  VIDP:[28.57,77.10],VABB:[19.09,72.87],VOBL:[13.20,77.71],VGHS:[23.84,90.40],
  WSSS:[1.36,103.99],WMKK:[2.75,101.71],VTBS:[13.68,100.75],VDPP:[11.55,104.84],RPLL:[14.51,121.02],
  VHHH:[22.31,113.91],VMMC:[22.15,113.59],RJTT:[35.55,139.78],RJAA:[35.76,140.39],
  RKSI:[37.46,126.44],ZBAA:[40.08,116.58],ZSPD:[31.14,121.81],ZSSS:[31.20,121.34],
  ZGGG:[23.39,113.30],RCTP:[25.08,121.23],
  YSSY:[-33.95,151.18],YMML:[-37.67,144.84],YBBN:[-27.38,153.12],YPPH:[-31.94,115.97],
  NZAA:[-37.01,174.79],NZWN:[-41.33,174.81],
  UUEE:[55.97,37.41],UUDD:[55.41,37.91],UUWW:[55.60,37.27],ULLI:[59.80,30.26],
  URSS:[43.45,39.96],UGTB:[41.67,44.95],
  LSGS:[46.22,7.33],EBCI:[50.46,4.45],ELLX:[49.63,6.20],
  EDDP:[51.42,12.24],EDDW:[53.05,8.79],EDHI:[53.54,9.83],
  LIRP:[43.68,10.40],LIMJ:[44.41,8.84],LICG:[36.65,14.42],
  LFLB:[45.64,5.88],LFKB:[42.55,9.48],LFKJ:[41.92,8.80],
  LEAM:[36.84,-2.37],LDZA:[45.74,16.07],LDDU:[42.56,18.27],LJLJ:[46.22,14.46],
  LQSA:[43.82,18.33],LWSK:[41.96,21.62],
};

function enrichAirportCoords(airport: any): any {
  if (!airport) return airport;
  if (airport.lat != null && airport.lng != null) return airport;
  const icao = airport.icao;
  if (icao && AIRPORT_COORDS[icao]) {
    return { ...airport, lat: AIRPORT_COORDS[icao][0], lng: AIRPORT_COORDS[icao][1] };
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

    await loadAircraftTypeCache(apiKey);

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
    const now = new Date();

    let enrichedCount = 0;
    const seenIds = new Set<string>();

    const normalized = {
      count: data.count || 0,
      results: (data.results || [])
        .filter((leg: any) => {
          // Deduplicate by id
          const legId = String(leg.id || leg.availability_id || '');
          if (seenIds.has(legId)) return false;
          seenIds.add(legId);

          // Expire stale listings (to_date in the past)
          if (leg.to_date) {
            const toDate = new Date(leg.to_date);
            if (toDate < now) return false;
          }
          return true;
        })
        .map((leg: any) => {
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

          const dep = enrichAirportCoords(depRaw);
          const arr = enrichAirportCoords(arrRaw);
          if ((dep?.lat != null && depRaw?.lat == null) || (arr?.lat != null && arrRaw?.lat == null)) enrichedCount++;

          return {
            id: leg.id || leg.availability_id || Math.random(),
            aircraft_type: aircraftType,
            aircraft_class: typeData?.class_name || null,
            aircraft_image: typeData?.image_url || null,
            aircraft_images: typeData?.all_images || [],
            aircraft_floor_plan: typeData?.floor_plan_url || null,
            aircraft_max_pax: typeData?.max_pax || null,
            aircraft_range_km: typeData?.range_km || null,
            company: leg.company || leg.operator?.name || '',
            from_date: leg.from_date || leg.from_date_utc || '',
            to_date: leg.to_date || leg.to_date_utc || '',
            price: leg.price ?? null,
            currency: leg.currency_code || leg.currency || 'USD',
            comment: leg.comment || '',
            departure: dep,
            arrival: arr,
          };
        }),
    };

    console.log(`[empty-legs] Enriched ${enrichedCount}/${normalized.results.length} legs with coordinates`);

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
