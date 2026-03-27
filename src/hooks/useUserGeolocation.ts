import { useEffect, useState } from "react";

interface UserGeoData {
  countryCode: string;       // e.g. "+971"
  city: string;              // e.g. "Dubai"
  country: string;           // e.g. "AE"
  countryName: string;       // e.g. "United Arab Emirates"
  airportIata: string;       // e.g. "DXB"
  airportIcao: string;       // e.g. "OMDB"
  airportLabel: string;      // e.g. "Dubai (OMDB)"
  latitude: number | null;
  longitude: number | null;
}

const CITY_AIRPORT_MAP: Record<string, { iata: string; icao: string; label: string }> = {
  "dubai": { iata: "DXB", icao: "OMDB", label: "Dubai (OMDB)" },
  "abu dhabi": { iata: "AUH", icao: "OMAA", label: "Abu Dhabi (OMAA)" },
  "london": { iata: "LHR", icao: "EGLL", label: "London (EGLL)" },
  "new york": { iata: "JFK", icao: "KJFK", label: "New York (KJFK)" },
  "los angeles": { iata: "LAX", icao: "KLAX", label: "Los Angeles (KLAX)" },
  "miami": { iata: "MIA", icao: "KMIA", label: "Miami (KMIA)" },
  "paris": { iata: "CDG", icao: "LFPG", label: "Paris (LFPG)" },
  "riyadh": { iata: "RUH", icao: "OERK", label: "Riyadh (OERK)" },
  "jeddah": { iata: "JED", icao: "OEJN", label: "Jeddah (OEJN)" },
  "doha": { iata: "DOH", icao: "OTHH", label: "Doha (OTHH)" },
  "singapore": { iata: "SIN", icao: "WSSS", label: "Singapore (WSSS)" },
  "hong kong": { iata: "HKG", icao: "VHHH", label: "Hong Kong (VHHH)" },
  "mumbai": { iata: "BOM", icao: "VABB", label: "Mumbai (VABB)" },
  "delhi": { iata: "DEL", icao: "VIDP", label: "Delhi (VIDP)" },
  "istanbul": { iata: "IST", icao: "LTFM", label: "Istanbul (LTFM)" },
  "moscow": { iata: "SVO", icao: "UUEE", label: "Moscow (UUEE)" },
  "frankfurt": { iata: "FRA", icao: "EDDF", label: "Frankfurt (EDDF)" },
  "zurich": { iata: "ZRH", icao: "LSZH", label: "Zurich (LSZH)" },
  "geneva": { iata: "GVA", icao: "LSGG", label: "Geneva (LSGG)" },
  "milan": { iata: "MXP", icao: "LIMC", label: "Milan (LIMC)" },
  "rome": { iata: "FCO", icao: "LIRF", label: "Rome (LIRF)" },
  "nice": { iata: "NCE", icao: "LFMN", label: "Nice (LFMN)" },
  "tokyo": { iata: "NRT", icao: "RJAA", label: "Tokyo (RJAA)" },
  "beijing": { iata: "PEK", icao: "ZBAA", label: "Beijing (ZBAA)" },
  "shanghai": { iata: "PVG", icao: "ZSPD", label: "Shanghai (ZSPD)" },
  "sydney": { iata: "SYD", icao: "YSSY", label: "Sydney (YSSY)" },
  "sao paulo": { iata: "GRU", icao: "SBGR", label: "São Paulo (SBGR)" },
  "lagos": { iata: "LOS", icao: "DNMM", label: "Lagos (DNMM)" },
  "johannesburg": { iata: "JNB", icao: "FAOR", label: "Johannesburg (FAOR)" },
  "cairo": { iata: "CAI", icao: "HECA", label: "Cairo (HECA)" },
  "kuala lumpur": { iata: "KUL", icao: "WMKK", label: "Kuala Lumpur (WMKK)" },
  "bangkok": { iata: "BKK", icao: "VTBS", label: "Bangkok (VTBS)" },
  "seoul": { iata: "ICN", icao: "RKSI", label: "Seoul (RKSI)" },
  "madrid": { iata: "MAD", icao: "LEMD", label: "Madrid (LEMD)" },
  "barcelona": { iata: "BCN", icao: "LEBL", label: "Barcelona (LEBL)" },
  "amsterdam": { iata: "AMS", icao: "EHAM", label: "Amsterdam (EHAM)" },
  "brussels": { iata: "BRU", icao: "EBBR", label: "Brussels (EBBR)" },
  "berlin": { iata: "BER", icao: "EDDB", label: "Berlin (EDDB)" },
  "munich": { iata: "MUC", icao: "EDDM", label: "Munich (EDDM)" },
  "vienna": { iata: "VIE", icao: "LOWW", label: "Vienna (LOWW)" },
  "lisbon": { iata: "LIS", icao: "LPPT", label: "Lisbon (LPPT)" },
  "athens": { iata: "ATH", icao: "LGAV", label: "Athens (LGAV)" },
  "muscat": { iata: "MCT", icao: "OOMS", label: "Muscat (OOMS)" },
  "bahrain": { iata: "BAH", icao: "OBBI", label: "Bahrain (OBBI)" },
  "kuwait": { iata: "KWI", icao: "OKBK", label: "Kuwait (OKBK)" },
  "chicago": { iata: "ORD", icao: "KORD", label: "Chicago (KORD)" },
  "dallas": { iata: "DFW", icao: "KDFW", label: "Dallas (KDFW)" },
  "houston": { iata: "IAH", icao: "KIAH", label: "Houston (KIAH)" },
  "san francisco": { iata: "SFO", icao: "KSFO", label: "San Francisco (KSFO)" },
  "washington": { iata: "IAD", icao: "KIAD", label: "Washington (KIAD)" },
  "toronto": { iata: "YYZ", icao: "CYYZ", label: "Toronto (CYYZ)" },
  "montreal": { iata: "YUL", icao: "CYUL", label: "Montreal (CYUL)" },
  "mexico city": { iata: "MEX", icao: "MMMX", label: "Mexico City (MMMX)" },
  "beirut": { iata: "BEY", icao: "OLBA", label: "Beirut (OLBA)" },
  "amman": { iata: "AMM", icao: "OJAI", label: "Amman (OJAI)" },
  "baghdad": { iata: "BGW", icao: "ORBI", label: "Baghdad (ORBI)" },
  "tehran": { iata: "IKA", icao: "OIIE", label: "Tehran (OIIE)" },
  "nairobi": { iata: "NBO", icao: "HKJK", label: "Nairobi (HKJK)" },
  "casablanca": { iata: "CMN", icao: "GMMN", label: "Casablanca (GMMN)" },
  "tunis": { iata: "TUN", icao: "DTTA", label: "Tunis (DTTA)" },
  "algiers": { iata: "ALG", icao: "DAAG", label: "Algiers (DAAG)" },
  "addis ababa": { iata: "ADD", icao: "HAAB", label: "Addis Ababa (HAAB)" },
  "dar es salaam": { iata: "DAR", icao: "HTDA", label: "Dar es Salaam (HTDA)" },
  "accra": { iata: "ACC", icao: "DGAA", label: "Accra (DGAA)" },
};

const COUNTRY_AIRPORT_MAP: Record<string, { iata: string; icao: string; label: string }> = {
  "AE": { iata: "DXB", icao: "OMDB", label: "Dubai (OMDB)" },
  "GB": { iata: "LHR", icao: "EGLL", label: "London (EGLL)" },
  "US": { iata: "JFK", icao: "KJFK", label: "New York (KJFK)" },
  "SA": { iata: "RUH", icao: "OERK", label: "Riyadh (OERK)" },
  "FR": { iata: "CDG", icao: "LFPG", label: "Paris (LFPG)" },
  "DE": { iata: "FRA", icao: "EDDF", label: "Frankfurt (EDDF)" },
  "CH": { iata: "ZRH", icao: "LSZH", label: "Zurich (LSZH)" },
  "IT": { iata: "FCO", icao: "LIRF", label: "Rome (LIRF)" },
  "ES": { iata: "MAD", icao: "LEMD", label: "Madrid (LEMD)" },
  "RU": { iata: "SVO", icao: "UUEE", label: "Moscow (UUEE)" },
  "IN": { iata: "DEL", icao: "VIDP", label: "Delhi (VIDP)" },
  "CN": { iata: "PEK", icao: "ZBAA", label: "Beijing (ZBAA)" },
  "JP": { iata: "NRT", icao: "RJAA", label: "Tokyo (RJAA)" },
  "KR": { iata: "ICN", icao: "RKSI", label: "Seoul (RKSI)" },
  "AU": { iata: "SYD", icao: "YSSY", label: "Sydney (YSSY)" },
  "BR": { iata: "GRU", icao: "SBGR", label: "São Paulo (SBGR)" },
  "NG": { iata: "LOS", icao: "DNMM", label: "Lagos (DNMM)" },
  "ZA": { iata: "JNB", icao: "FAOR", label: "Johannesburg (FAOR)" },
  "TR": { iata: "IST", icao: "LTFM", label: "Istanbul (LTFM)" },
  "SG": { iata: "SIN", icao: "WSSS", label: "Singapore (WSSS)" },
  "HK": { iata: "HKG", icao: "VHHH", label: "Hong Kong (VHHH)" },
  "QA": { iata: "DOH", icao: "OTHH", label: "Doha (OTHH)" },
  "BH": { iata: "BAH", icao: "OBBI", label: "Bahrain (OBBI)" },
  "KW": { iata: "KWI", icao: "OKBK", label: "Kuwait (OKBK)" },
  "OM": { iata: "MCT", icao: "OOMS", label: "Muscat (OOMS)" },
  "EG": { iata: "CAI", icao: "HECA", label: "Cairo (HECA)" },
  "NL": { iata: "AMS", icao: "EHAM", label: "Amsterdam (EHAM)" },
  "BE": { iata: "BRU", icao: "EBBR", label: "Brussels (EBBR)" },
  "AT": { iata: "VIE", icao: "LOWW", label: "Vienna (LOWW)" },
  "PT": { iata: "LIS", icao: "LPPT", label: "Lisbon (LPPT)" },
  "GR": { iata: "ATH", icao: "LGAV", label: "Athens (LGAV)" },
  "CA": { iata: "YYZ", icao: "CYYZ", label: "Toronto (CYYZ)" },
  "MX": { iata: "MEX", icao: "MMMX", label: "Mexico City (MMMX)" },
  "MY": { iata: "KUL", icao: "WMKK", label: "Kuala Lumpur (WMKK)" },
  "TH": { iata: "BKK", icao: "VTBS", label: "Bangkok (VTBS)" },
  "LB": { iata: "BEY", icao: "OLBA", label: "Beirut (OLBA)" },
  "JO": { iata: "AMM", icao: "OJAI", label: "Amman (OJAI)" },
  "IQ": { iata: "BGW", icao: "ORBI", label: "Baghdad (ORBI)" },
  "IR": { iata: "IKA", icao: "OIIE", label: "Tehran (OIIE)" },
  "KE": { iata: "NBO", icao: "HKJK", label: "Nairobi (HKJK)" },
  "MA": { iata: "CMN", icao: "GMMN", label: "Casablanca (GMMN)" },
  "TN": { iata: "TUN", icao: "DTTA", label: "Tunis (DTTA)" },
  "DZ": { iata: "ALG", icao: "DAAG", label: "Algiers (DAAG)" },
  "ET": { iata: "ADD", icao: "HAAB", label: "Addis Ababa (HAAB)" },
  "TZ": { iata: "DAR", icao: "HTDA", label: "Dar es Salaam (HTDA)" },
  "GH": { iata: "ACC", icao: "DGAA", label: "Accra (DGAA)" },
  "CY": { iata: "LCA", icao: "LCLK", label: "Larnaca (LCLK)" },
};

const CACHE_KEY = "uj_user_geo";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const defaultGeo: UserGeoData = {
  countryCode: "+971",
  city: "Dubai",
  country: "AE",
  countryName: "United Arab Emirates",
  airportIata: "DXB",
  airportIcao: "OMDB",
  airportLabel: "Dubai (OMDB)",
  latitude: null,
  longitude: null,
};

const useUserGeolocation = (): UserGeoData => {
  const [geo, setGeo] = useState<UserGeoData>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return data;
      }
    } catch {}
    return defaultGeo;
  });

  useEffect(() => {
    // Skip if we have a valid cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return;
      }
    } catch {}

    const fetchGeo = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const cityLower = (data.city || "").toLowerCase();
        const countryCodeIso = (data.country_code || "AE").toUpperCase();

        // Resolve airport: city first, then country fallback
        const airportInfo =
          CITY_AIRPORT_MAP[cityLower] ||
          COUNTRY_AIRPORT_MAP[countryCodeIso] ||
          { iata: "DXB", icao: "OMDB", label: "Dubai (OMDB)" };

        const result: UserGeoData = {
          countryCode: data.country_calling_code || "+971",
          city: data.city || "Dubai",
          country: countryCodeIso,
          countryName: data.country_name || "United Arab Emirates",
          airportIata: airportInfo.iata,
          airportIcao: airportInfo.icao,
          airportLabel: airportInfo.label,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
        };

        setGeo(result);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() }));
      } catch (error) {
        console.error("Geolocation fetch error:", error);
      }
    };

    fetchGeo();
  }, []);

  return geo;
};

export default useUserGeolocation;
export type { UserGeoData };
