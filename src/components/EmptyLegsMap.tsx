import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Map, LayoutGrid, RefreshCw } from "lucide-react";
import { useEmptyLegs, type EmptyLeg } from "@/hooks/useAviapages";
import EmptyLegsMapView from "./empty-legs/EmptyLegsMapView";
import EmptyLegCard from "./empty-legs/EmptyLegCard";
import EmptyLegPopup from "./empty-legs/EmptyLegPopup";
import AIRPORT_COORDS from "@/lib/airportCoords";

const regions = ["All", "Americas", "Europe", "Middle East", "Asia"];

function enrichCoords(leg: EmptyLeg): EmptyLeg {
  const enrichAirport = (airport: EmptyLeg["departure"]) => {
    if (!airport) return airport;
    if (airport.lat !== null && airport.lng !== null) return airport;
    const coords = AIRPORT_COORDS[airport.icao];
    if (coords) return { ...airport, lat: coords[0], lng: coords[1] };
    return airport;
  };
  return { ...leg, departure: enrichAirport(leg.departure), arrival: enrichAirport(leg.arrival) };
}

const fallbackLegs: EmptyLeg[] = [
  { id: 1, aircraft_type: "Citation XLS+", company: "", from_date: "2025-04-12T10:00", to_date: "2025-04-12T13:00", price: null, currency: "USD", comment: "", departure: { id: 1, name: "Teterboro", iata: "", icao: "KTEB", city: "New York", country: "United States", lat: 40.85, lng: -74.06 }, arrival: { id: 2, name: "Opa-locka Executive", iata: "", icao: "KOPF", city: "Miami", country: "United States", lat: 25.91, lng: -80.28 } },
  { id: 2, aircraft_type: "Phenom 300E", company: "", from_date: "2025-04-15T08:00", to_date: "2025-04-15T10:30", price: null, currency: "EUR", comment: "", departure: { id: 3, name: "Luton", iata: "LTN", icao: "EGGW", city: "London", country: "United Kingdom", lat: 51.87, lng: -0.37 }, arrival: { id: 4, name: "Geneva Intl", iata: "GVA", icao: "LSGG", city: "Geneva", country: "Switzerland", lat: 46.24, lng: 6.11 } },
  { id: 3, aircraft_type: "Global 6000", company: "", from_date: "2025-04-18T14:00", to_date: "2025-04-18T21:00", price: null, currency: "USD", comment: "", departure: { id: 5, name: "Al Maktoum Intl", iata: "DWC", icao: "OMDW", city: "Dubai", country: "UAE", lat: 24.89, lng: 55.17 }, arrival: { id: 6, name: "Luton", iata: "LTN", icao: "EGGW", city: "London", country: "United Kingdom", lat: 51.87, lng: -0.37 } },
  { id: 4, aircraft_type: "Citation CJ3+", company: "", from_date: "2025-04-22T16:00", to_date: "2025-04-22T17:30", price: null, currency: "USD", comment: "", departure: { id: 7, name: "Van Nuys", iata: "VNY", icao: "KVNY", city: "Los Angeles", country: "United States", lat: 34.21, lng: -118.49 }, arrival: { id: 8, name: "Harry Reid Intl", iata: "LAS", icao: "KLAS", city: "Las Vegas", country: "United States", lat: 36.08, lng: -115.15 } },
  { id: 5, aircraft_type: "Phenom 100EV", company: "", from_date: "2025-04-25T09:00", to_date: "2025-04-25T10:45", price: null, currency: "EUR", comment: "", departure: { id: 9, name: "Le Bourget", iata: "LBG", icao: "LFPB", city: "Paris", country: "France", lat: 48.97, lng: 2.44 }, arrival: { id: 10, name: "Nice Côte d'Azur", iata: "NCE", icao: "LFMN", city: "Nice", country: "France", lat: 43.66, lng: 7.22 } },
  { id: 6, aircraft_type: "Falcon 2000LXS", company: "", from_date: "2025-05-01T07:00", to_date: "2025-05-01T11:00", price: null, currency: "USD", comment: "", departure: { id: 11, name: "Changi", iata: "SIN", icao: "WSSS", city: "Singapore", country: "Singapore", lat: 1.36, lng: 103.99 }, arrival: { id: 12, name: "Hong Kong Intl", iata: "HKG", icao: "VHHH", city: "Hong Kong", country: "Hong Kong", lat: 22.31, lng: 113.91 } },
];

const getRegionForCountry = (country: string): string => {
  const map: Record<string, string> = {
    "United States": "Americas", "Canada": "Americas", "Mexico": "Americas", "Brazil": "Americas",
    "Argentina": "Americas", "Chile": "Americas", "Colombia": "Americas", "Peru": "Americas",
    "United Kingdom": "Europe", "France": "Europe", "Germany": "Europe", "Switzerland": "Europe",
    "Italy": "Europe", "Spain": "Europe", "Netherlands": "Europe", "Czech Republic": "Europe",
    "Poland": "Europe", "Austria": "Europe", "Belgium": "Europe", "Portugal": "Europe",
    "Sweden": "Europe", "Norway": "Europe", "Denmark": "Europe", "Finland": "Europe",
    "Ireland": "Europe", "Greece": "Europe", "Romania": "Europe", "Hungary": "Europe",
    "Croatia": "Europe", "Turkey": "Europe", "Cyprus": "Europe",
    "UAE": "Middle East", "Saudi Arabia": "Middle East", "Qatar": "Middle East",
    "Bahrain": "Middle East", "Israel": "Middle East", "Georgia": "Middle East",
    "Kuwait": "Middle East", "Oman": "Middle East", "Jordan": "Middle East", "Lebanon": "Middle East",
    "Singapore": "Asia", "Hong Kong": "Asia", "Japan": "Asia", "South Korea": "Asia",
    "China": "Asia", "India": "Asia", "Thailand": "Asia", "Malaysia": "Asia",
    "Indonesia": "Asia", "Philippines": "Asia", "Taiwan": "Asia",
  };
  return map[country] || "Other";
};

const EmptyLegsMap = () => {
  const [selectedLeg, setSelectedLeg] = useState<EmptyLeg | null>(null);
  const [activeRegion, setActiveRegion] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "map">("map");
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useEmptyLegs(activeRegion);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => { refetch(); }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 800);
  };

  const legs = useMemo(() => {
    const raw = data?.results?.length ? data.results.map(enrichCoords) : fallbackLegs;
    if (activeRegion === "All") return raw;
    return raw.filter((l) => l.departure && getRegionForCountry(l.departure.country) === activeRegion);
  }, [data, activeRegion]);

  const mappableLegs = useMemo(
    () => legs.filter((l) => {
      const dep = l.departure;
      const arr = l.arrival;
      return dep != null && arr != null
        && typeof dep.lat === "number" && !isNaN(dep.lat)
        && typeof dep.lng === "number" && !isNaN(dep.lng)
        && typeof arr.lat === "number" && !isNaN(arr.lat)
        && typeof arr.lng === "number" && !isNaN(arr.lng);
    }),
    [legs]
  );

  const handleLegClick = useCallback((leg: EmptyLeg) => setSelectedLeg(leg), []);

  // Mercator projection for map coordinates
  const toMapCoords = useCallback((lat: number | null | undefined, lng: number | null | undefined): [number, number] => {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return [50, 25];
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 50 / 2 - (mercN / Math.PI) * (50 / 2);
    return [x, Math.max(0, Math.min(50, y))];
  }, []);

  return (
    <section id="empty-legs" className="section-padding overflow-hidden section-alt">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-8">
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Exclusive Opportunity</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground">
            Fly Private for <span className="text-gradient-gold italic">Less</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-lg mx-auto text-center mb-16">
          <p className="text-[15px] text-muted-foreground font-light leading-[1.9] mb-2">
            One-way repositioning flights at up to 75% lower cost.
          </p>
          <p className="text-[13px] text-muted-foreground font-light leading-[1.9]">
            When aircraft need to reposition, you benefit. Same jet. Same service. Fraction of the price.
          </p>
          {data?.count ? (
            <p className="text-[11px] text-primary mt-3 font-medium">{data.count.toLocaleString()} empty legs available worldwide</p>
          ) : !isLoading && !error ? (
            <p className="text-[11px] text-muted-foreground/70 mt-3 font-light">Showing curated routes</p>
          ) : null}
        </motion.div>

        {/* Filters + View Toggle */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300 ${
                activeRegion === r
                  ? "bg-[hsl(var(--selection))] text-[hsl(var(--selection-foreground))] shadow-[0_4px_12px_-4px_hsla(0,0%,0%,0.3)]"
                  : "border border-border text-foreground/50 hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {r}
            </button>
          ))}
        </motion.div>

        <div className="flex justify-center mb-14">
          <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 gap-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-[10px] tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                viewMode === "cards"
                  ? "bg-[hsl(var(--selection))] text-[hsl(var(--selection-foreground))] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid size={12} /> Cards
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-[10px] tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                viewMode === "map"
                  ? "bg-[hsl(var(--selection))] text-[hsl(var(--selection-foreground))] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Map size={12} /> Map
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {!isLoading && viewMode === "map" && (
          mappableLegs.length > 0 ? (
            <EmptyLegsMapView legs={mappableLegs} selectedLeg={selectedLeg} onLegClick={handleLegClick} onClose={() => setSelectedLeg(null)} toMapCoords={toMapCoords} isLiveData={!!data?.results?.length} />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-16 text-center mb-16">
              <Map size={32} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-[13px] text-muted-foreground font-light">No mappable routes found. Try the cards view or a different region.</p>
            </div>
          )
        )}

        {!isLoading && viewMode === "cards" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            {legs.slice(0, 12).map((leg, i) => (
              <EmptyLegCard key={leg.id} leg={leg} index={i} onClick={() => handleLegClick(leg)} />
            ))}
          </div>
        )}

        {selectedLeg && viewMode === "cards" && (
          <EmptyLegPopup leg={selectedLeg} onClose={() => setSelectedLeg(null)} />
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
          <a
            href="https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20available%20empty%20legs."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500"
          >
            Request Empty Leg <ArrowRight size={10} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EmptyLegsMap;
