import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useEmptyLegs, type EmptyLeg } from "@/hooks/useAviapages";
import EmptyLegsMapView from "./empty-legs/EmptyLegsMapView";
import EmptyLegCard from "./empty-legs/EmptyLegCard";
import EmptyLegPopup from "./empty-legs/EmptyLegPopup";

const regions = ["All", "Americas", "Europe", "Middle East", "Asia"];

const fallbackLegs: EmptyLeg[] = [
  { id: 1, aircraft_type: "Citation XLS+", company: "", from_date: "2025-04-12T10:00", to_date: "2025-04-12T13:00", price: null, currency: "USD", comment: "", departure: { id: 1, name: "Teterboro", iata: "", icao: "TEB", city: "New York", country: "United States", lat: 40.85, lng: -74.06 }, arrival: { id: 2, name: "Opa-locka Executive", iata: "", icao: "OPF", city: "Miami", country: "United States", lat: 25.91, lng: -80.28 } },
  { id: 2, aircraft_type: "Phenom 300E", company: "", from_date: "2025-04-15T08:00", to_date: "2025-04-15T10:30", price: null, currency: "EUR", comment: "", departure: { id: 3, name: "Luton", iata: "LTN", icao: "EGGW", city: "London", country: "United Kingdom", lat: 51.87, lng: -0.37 }, arrival: { id: 4, name: "Geneva Intl", iata: "GVA", icao: "LSGG", city: "Geneva", country: "Switzerland", lat: 46.24, lng: 6.11 } },
  { id: 3, aircraft_type: "Global 6000", company: "", from_date: "2025-04-18T14:00", to_date: "2025-04-18T21:00", price: null, currency: "USD", comment: "", departure: { id: 5, name: "Al Maktoum Intl", iata: "DWC", icao: "OMDW", city: "Dubai", country: "UAE", lat: 24.89, lng: 55.17 }, arrival: { id: 6, name: "Luton", iata: "LTN", icao: "EGGW", city: "London", country: "United Kingdom", lat: 51.87, lng: -0.37 } },
  { id: 4, aircraft_type: "Citation CJ3+", company: "", from_date: "2025-04-22T16:00", to_date: "2025-04-22T17:30", price: null, currency: "USD", comment: "", departure: { id: 7, name: "Van Nuys", iata: "VNY", icao: "KVNY", city: "Los Angeles", country: "United States", lat: 34.21, lng: -118.49 }, arrival: { id: 8, name: "Harry Reid Intl", iata: "LAS", icao: "KLAS", city: "Las Vegas", country: "United States", lat: 36.08, lng: -115.15 } },
  { id: 5, aircraft_type: "Phenom 100EV", company: "", from_date: "2025-04-25T09:00", to_date: "2025-04-25T10:45", price: null, currency: "EUR", comment: "", departure: { id: 9, name: "Le Bourget", iata: "LBG", icao: "LFPB", city: "Paris", country: "France", lat: 48.97, lng: 2.44 }, arrival: { id: 10, name: "Nice Côte d'Azur", iata: "NCE", icao: "LFMN", city: "Nice", country: "France", lat: 43.66, lng: 7.22 } },
  { id: 6, aircraft_type: "Falcon 2000LXS", company: "", from_date: "2025-05-01T07:00", to_date: "2025-05-01T11:00", price: null, currency: "USD", comment: "", departure: { id: 11, name: "Changi", iata: "SIN", icao: "WSSS", city: "Singapore", country: "Singapore", lat: 1.36, lng: 103.99 }, arrival: { id: 12, name: "Hong Kong Intl", iata: "HKG", icao: "VHHH", city: "Hong Kong", country: "Hong Kong", lat: 22.31, lng: 113.91 } },
];

const getRegionForCountry = (country: string): string => {
  const map: Record<string, string> = {
    "United States": "Americas", "Canada": "Americas", "Mexico": "Americas", "Brazil": "Americas",
    "United Kingdom": "Europe", "France": "Europe", "Germany": "Europe", "Switzerland": "Europe", "Italy": "Europe", "Spain": "Europe", "Netherlands": "Europe",
    "UAE": "Middle East", "Saudi Arabia": "Middle East", "Qatar": "Middle East", "Bahrain": "Middle East",
    "Singapore": "Asia", "Hong Kong": "Asia", "Japan": "Asia", "South Korea": "Asia", "China": "Asia", "India": "Asia", "Thailand": "Asia",
  };
  return map[country] || "Other";
};

const EmptyLegsMap = () => {
  const [selectedLeg, setSelectedLeg] = useState<EmptyLeg | null>(null);
  const [activeRegion, setActiveRegion] = useState("All");
  const { data, isLoading, error } = useEmptyLegs(activeRegion);

  const legs = useMemo(() => {
    const source = data?.results?.length ? data.results : fallbackLegs;
    if (activeRegion === "All") return source;
    return source.filter((l) => l.departure && getRegionForCountry(l.departure.country) === activeRegion);
  }, [data, activeRegion]);

  const handleLegClick = useCallback((leg: EmptyLeg) => setSelectedLeg(leg), []);

  const toMapCoords = (lat: number | null, lng: number | null): [number, number] => {
    if (lat === null || lng === null) return [50, 50];
    return [((lng + 180) / 360) * 100, ((90 - lat) / 180) * 100];
  };

  return (
    <section id="empty-legs" className="section-padding overflow-hidden relative">
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
          {!data?.results?.length && !isLoading && !error && (
            <p className="text-[11px] text-muted-foreground/70 mt-3 font-light">Showing curated routes</p>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3 mb-14">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-500 ${
                activeRegion === r
                  ? "bg-gradient-gold text-primary-foreground glow-gold"
                  : "border border-border text-foreground/50 hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {r}
            </button>
          ))}
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}

        {!isLoading && (
          <EmptyLegsMapView legs={legs} selectedLeg={selectedLeg} onLegClick={handleLegClick} onClose={() => setSelectedLeg(null)} toMapCoords={toMapCoords} />
        )}

        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            {legs.map((leg, i) => (
              <EmptyLegCard key={leg.id} leg={leg} index={i} onClick={() => handleLegClick(leg)} />
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
          <a href="#cta" className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
            View All Empty Legs <ArrowRight size={10} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EmptyLegsMap;