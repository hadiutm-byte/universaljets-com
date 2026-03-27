import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AVIAPAGES_BASE = 'https://dir.aviapages.com';

// ─── Aircraft type cache (populated on cold start) ──────────────────────────
interface AircraftTypeMeta {
  image_url: string | null;
  all_images: { url: string; type: string }[];
  floor_plan_url: string | null;
  class_name: string;
  max_pax: number | null;
  range_km: number | null;
}

let aircraftTypeCache: Record<string, AircraftTypeMeta> = {};
let cacheLoaded = false;

const BLOCKED_IMAGE_TYPES = new Set(['tail', 'registration']);

async function loadAircraftTypeCache(apiKey: string) {
  if (cacheLoaded) return;
  try {
    // Fetch up to 2 pages of aircraft types (500 + 500 = ~1000 types)
    for (let pg = 1; pg <= 2; pg++) {
      const response = await fetch(`${AVIAPAGES_BASE}/api/aircraft_types/?page_size=500&page=${pg}`, {
        headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
      });
      if (!response.ok) break;
      const data = await response.json();
      const results = data.results || [];
      if (results.length === 0) break;

      for (const at of results) {
        const name = String(at.name || '').toLowerCase().trim();
        if (!name) continue;

        const images = Array.isArray(at.images) ? at.images : [];
        const allImages: { url: string; type: string }[] = [];
        let floorPlanUrl: string | null = null;

        for (const img of images) {
          const url = img.media?.path || img.url || null;
          const imgType = String(img.image_type || img.type || 'exterior').toLowerCase();
          if (BLOCKED_IMAGE_TYPES.has(imgType)) continue;
          if (url) {
            allImages.push({ url, type: imgType });
            if (imgType === 'floor_plan' || imgType === 'floorplan' || imgType === 'layout') {
              floorPlanUrl = url;
            }
          }
        }

        // If notail images exist, drop exterior images (they show painted registrations)
        const hasNotail = allImages.some(i => i.type === 'notail');
        const filteredImages = hasNotail ? allImages.filter(i => i.type !== 'exterior') : allImages;
        const heroUrl = filteredImages.find(i => i.type === 'notail')?.url || filteredImages[0]?.url || null;

        aircraftTypeCache[name] = {
          image_url: heroUrl,
          all_images: filteredImages,
          floor_plan_url: floorPlanUrl,
          class_name: String(at.class_name || at.aircraft_class?.name || ''),
          max_pax: toFiniteNum(at.pax_maximum),
          range_km: toFiniteNum(at.range_maximum),
        };
      }

      if (!data.next) break;
    }
    console.log(`[empty-legs] Cached ${Object.keys(aircraftTypeCache).length} aircraft types`);
  } catch (e) {
    console.error('[empty-legs] Failed to load aircraft type cache:', e);
  }
  cacheLoaded = true;
}

function lookupAircraftType(typeName: string): AircraftTypeMeta | null {
  const lower = typeName.toLowerCase().trim();
  if (aircraftTypeCache[lower]) return aircraftTypeCache[lower];
  // Fuzzy match: try substring both directions
  for (const [key, val] of Object.entries(aircraftTypeCache)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Coerce to finite number or null */
function toFiniteNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Safe string coercion */
function toStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

/** Extract price defensively from multiple possible API fields */
function extractPrice(leg: Record<string, unknown>): number | null {
  return toFiniteNum(leg.price) ??
    toFiniteNum(leg.charter_price) ??
    toFiniteNum(leg.price_total) ??
    toFiniteNum(leg.total_price) ??
    toFiniteNum(leg.amount) ??
    null;
}

/** Extract currency defensively */
function extractCurrency(leg: Record<string, unknown>): string {
  const company = (leg.company || {}) as Record<string, unknown>;
  return toStr(leg.currency_code) || toStr(leg.currency) || toStr(leg.price_currency) || toStr(company.currency) || 'USD';
}

// ─── Airport coordinates (ICAO → [lat, lng]) ───────────────────────────────
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

// ─── Region → ISO country code mapping ──────────────────────────────────────
const REGION_MAP: Record<string, Set<string>> = {
  'middle_east': new Set(['AE','SA','QA','BH','OM','KW','JO','LB','IL','IQ','IR','YE','GE','AM','AZ']),
  'asia': new Set(['SG','HK','JP','KR','IN','TH','MY','ID','CN','PH','TW','VN','KH','MM','LK','BD','NP','MV','MN','KZ','UZ']),
  'europe': new Set(['GB','FR','DE','IT','ES','CH','AT','NL','BE','PT','SE','NO','DK','FI','IE','CZ','PL','GR','RO','HU','HR','CY','TR','LU','SI','BA','MK','RS','BG','SK','LT','LV','EE','IS','MT']),
  'americas': new Set(['US','CA','MX','BR','AR','CO','CL','PE','EC','VE','DO','JM','BS','BB','TT','PA','CR','GT','PR','VI','KY','TC','AG','CW','AW','SX','BZ','HN','NI','SV','UY','PY','BO','GY','SR']),
  'africa': new Set(['ZA','NG','KE','EG','MA','TZ','GH','ET','CI','SN','RW','UG','MU','MZ','CM','AO','ZW','BW','NA']),
};

// ─── ICAO prefix → country code (reliable fallback) ─────────────────────────
const ICAO_PREFIX_COUNTRY: Record<string, string> = {
  K:'US',C:'CA',M:'MX',T:'',S:'',
  EG:'GB',EI:'IE',LF:'FR',ED:'DE',LI:'IT',LE:'ES',LS:'CH',LO:'AT',EH:'NL',EB:'BE',LP:'PT',
  ES:'SE',EN:'NO',EK:'DK',EF:'FI',LK:'CZ',EP:'PL',LG:'GR',LR:'RO',LH:'HU',LD:'HR',LC:'CY',
  LT:'TR',EL:'LU',LJ:'SI',LQ:'BA',LW:'MK',LY:'RS',LB:'BG',LZ:'SK',EY:'LT',EV:'LV',EE:'EE',BI:'IS',LM:'MT',
  OM:'AE',OE:'SA',OT:'QA',OB:'BH',OO:'OM',OK:'KW',OJ:'JO',OL:'LB',LL:'IL',OR:'IQ',OI:'IR',OY:'YE',UG:'GE',
  WS:'SG',VH:'HK',RJ:'JP',RK:'KR',VI:'IN',VT:'TH',WM:'MY',WI:'ID',ZB:'CN',ZS:'CN',ZG:'CN',RP:'PH',RC:'TW',VV:'VN',VD:'KH',
  FA:'ZA',DN:'NG',HK:'KE',HE:'EG',GM:'MA',HT:'TZ',DG:'GH',
  SB:'BR',SA:'AR',SC:'CL',SK:'CO',SP:'PE',SE:'EC',SV:'VE',
  UU:'RU',UL:'RU',UR:'RU',
};

function icaoToCountry(icao: string): string {
  if (!icao || icao.length < 2) return '';
  const upper = icao.toUpperCase();
  // Try 2-char prefix first (most specific)
  const two = upper.substring(0, 2);
  if (ICAO_PREFIX_COUNTRY[two]) return ICAO_PREFIX_COUNTRY[two];
  // US airports start with K
  if (upper.startsWith('K') && upper.length === 4) return 'US';
  // Canadian airports start with C
  if (upper.startsWith('C') && upper.length === 4) return 'CA';
  // Try 1-char for some regions
  const one = upper[0];
  if (one === 'K') return 'US';
  if (one === 'P') return 'US'; // Pacific US (PHNL etc)
  return '';
}

// ─── Country code normalization ─────────────────────────────────────────────

function normalizeCountryCode(value: unknown): string {
  return String(value || "").trim().toUpperCase();
}

function getLegCountryCodes(leg: Record<string, unknown>): string[] {
  const dep = leg.dep_airport as Record<string, unknown> | null;
  const arr = leg.arr_airport as Record<string, unknown> | null;

  const depCity = dep?.city as Record<string, unknown> | undefined;
  const arrCity = arr?.city as Record<string, unknown> | undefined;

  const countryObj = (city: Record<string, unknown> | undefined) => city?.country as Record<string, unknown> | undefined;

  let depCountry =
    normalizeCountryCode(depCity?.country_code) ||
    normalizeCountryCode(countryObj(depCity)?.iso_alpha2) ||
    normalizeCountryCode(countryObj(depCity)?.code) ||
    normalizeCountryCode(dep?.country_code);

  let arrCountry =
    normalizeCountryCode(arrCity?.country_code) ||
    normalizeCountryCode(countryObj(arrCity)?.iso_alpha2) ||
    normalizeCountryCode(countryObj(arrCity)?.code) ||
    normalizeCountryCode(arr?.country_code);

  // ICAO fallback — most reliable when API country data is missing
  if (!depCountry) depCountry = icaoToCountry(toStr(dep?.icao));
  if (!arrCountry) arrCountry = icaoToCountry(toStr(arr?.icao));

  return [depCountry, arrCountry].filter(Boolean);
}

function normalizeRegion(value: string | null | undefined): string {
  const v = String(value || '').trim().toLowerCase();
  if (!v || v === 'all') return 'all';
  if (v === 'middle east' || v === 'middle-east' || v === 'middle_east') return 'middle_east';
  if (v === 'asia') return 'asia';
  if (v === 'europe') return 'europe';
  if (v === 'americas' || v === 'america') return 'americas';
  if (v === 'africa') return 'africa';
  return 'all';
}

function legMatchesRegion(leg: Record<string, unknown>, rawRegion: string): boolean {
  const region = normalizeRegion(rawRegion);
  if (region === 'all') return true;
  const allowed = REGION_MAP[region];
  if (!allowed || allowed.size === 0) return true;

  const countries = getLegCountryCodes(leg);
  return countries.some(code => allowed.has(code));
}

// ─── Airport normalization ──────────────────────────────────────────────────

function normalizeAirport(raw: Record<string, unknown> | null | undefined) {
  if (!raw) return null;
  const icao = toStr(raw.icao);
  const lat = toFiniteNum(raw.latitude) ?? toFiniteNum(raw.lat);
  const lng = toFiniteNum(raw.longitude) ?? toFiniteNum(raw.lng) ?? toFiniteNum(raw.lon);

  // Enrich from static lookup if API didn't provide coords
  const coordsFromLookup = icao && AIRPORT_COORDS[icao] ? AIRPORT_COORDS[icao] : null;

  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    name: toStr(raw.name),
    iata: toStr(raw.iata),
    icao,
    city: typeof raw.city === 'object' && raw.city !== null
      ? toStr((raw.city as Record<string, unknown>).name)
      : toStr(raw.city),
    country: typeof raw.city === 'object' && raw.city !== null
      ? toStr(((raw.city as Record<string, unknown>).country as Record<string, unknown>)?.name)
      : toStr(raw.country),
    lat: lat ?? coordsFromLookup?.[0] ?? null,
    lng: lng ?? coordsFromLookup?.[1] ?? null,
  };
}

// ─── Leg normalization (B2C sanitized) ──────────────────────────────────────

function normalizeLeg(leg: Record<string, unknown>, typeData: AircraftTypeMeta | null) {
  const aircraftType = toStr(leg.aircraft_type, 'Private Jet');

  const dep = normalizeAirport(leg.dep_airport as Record<string, unknown> | null);
  const arr = normalizeAirport(leg.arr_airport as Record<string, unknown> | null);

  // Collect all images: from the leg itself + from type cache
  const legImages = Array.isArray(leg.aircraft_images) ? leg.aircraft_images : [];
  const allImageCandidates = [
    ...(typeData?.all_images || []),
    ...legImages.map((img: unknown) => {
      if (!img || typeof img !== 'object') return null;
      const o = img as Record<string, unknown>;
      const url = toStr(o.media && typeof o.media === 'object' ? (o.media as Record<string, unknown>).path : o.url);
      const type = toStr(o.image_type || o.type, 'exterior').toLowerCase();
      return url ? { url, type } : null;
    }).filter(Boolean),
  ] as { url: string; type: string }[];

  // Deduplicate by URL and filter blocked types
  const seenUrls = new Set<string>();
  const rawImages: { url: string; type: string }[] = [];
  for (const img of allImageCandidates) {
    if (BLOCKED_IMAGE_TYPES.has(img.type)) continue;
    if (seenUrls.has(img.url)) continue;
    seenUrls.add(img.url);
    rawImages.push(img);
  }

  // If notail images exist, drop exterior images (they show painted registrations)
  const hasNotail = rawImages.some(i => i.type === 'notail');
  const images = hasNotail ? rawImages.filter(i => i.type !== 'exterior') : rawImages;

  // Prefer notail for hero image
  const heroImage = images.find(i => i.type === 'notail')?.url || images[0]?.url || typeData?.image_url || null;

  return {
    id: typeof leg.id === 'number' ? leg.id : (typeof leg.availability_id === 'number' ? leg.availability_id : 0),
    aircraft_type: aircraftType,
    aircraft_class: typeData?.class_name || null,
    aircraft_image: heroImage,
    aircraft_images: images,
    aircraft_floor_plan: typeData?.floor_plan_url || null,
    aircraft_max_pax: typeData?.max_pax || null,
    aircraft_range_km: typeData?.range_km || null,
    company: '',  // NEVER expose operator identity to B2C
    from_date: toStr(leg.from_date) || toStr(leg.from_date_utc),
    to_date: toStr(leg.to_date) || toStr(leg.to_date_utc),
    price: extractPrice(leg),
    currency: extractCurrency(leg),
    comment: toStr(leg.comment),
    departure: dep,
    arrival: arr,
  };
}

// ─── Main handler ───────────────────────────────────────────────────────────

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

    const maxPages = 20;
    const pageSize = 100;

    const now = new Date();
    const seenIds = new Set<number>();
    const allResults: ReturnType<typeof normalizeLeg>[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= maxPages) {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });

      const apiUrl = `${AVIAPAGES_BASE}/api/availabilities/?${params.toString()}`;
      console.log(`[empty-legs] Page ${page}: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Token ${apiKey}`, 'Accept': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[empty-legs] API error [${response.status}]: ${errorText.substring(0, 200)}`);
        // On rate limit, wait and retry once
        if (response.status === 429) {
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
        break;
      }

      const data = await response.json();
      const items: unknown[] = Array.isArray(data.results) ? data.results : (Array.isArray(data.items) ? data.items : []);

      if (items.length === 0) break;

      for (const rawLeg of items) {
        if (!rawLeg || typeof rawLeg !== 'object') continue;
        const leg = rawLeg as Record<string, unknown>;

        // Stable unique ID
        const legId = typeof leg.id === 'number' ? leg.id : (typeof leg.availability_id === 'number' ? leg.availability_id : 0);
        if (legId === 0 || seenIds.has(legId)) continue;
        seenIds.add(legId);

        // Skip expired listings
        const toDateStr = toStr(leg.to_date);
        if (toDateStr) {
          const toDate = new Date(toDateStr);
          if (!isNaN(toDate.getTime()) && toDate < now) continue;
        }

        const aircraftType = toStr(leg.aircraft_type, 'Private Jet');
        const typeData = lookupAircraftType(aircraftType);
        allResults.push(normalizeLeg(leg, typeData));
      }

      // Only continue if API signals more pages exist
      hasMore = Boolean(data.next);
      page += 1;
    }

    console.log(`[empty-legs] Fetched ${page - 1} pages, ${allResults.length} unique results`);

    return new Response(JSON.stringify({ count: allResults.length, results: allResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[empty-legs] Error:', error);
    return new Response(JSON.stringify({ count: 0, results: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
